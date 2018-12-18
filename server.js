const express = require("express");
const bodyParser = require("body-parser");
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date()
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date()
    }
  ]
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  const user = database.users.find(user => user.id === id);
  if (user) res.json(user);
  res.status(404).json("error getting user");
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  const user = database.users.find(user => user.id === id);
  if (user) {
    user.entries++;
    res.json(user.entries);
  }
  res.status(404).json("error getting user");
});

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//   // res = false
// });

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

app.post("/signin", (req, res) => {
  const users = database.users;

  const user = users.find(
    user => req.body.email === user.email && req.body.password === user.password
  );
  if (user) res.json(user);
  else res.status(400).json("error loggin in");
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function(err, hash) {
    console.log({ hash });
  });

  database.users.push({
    id: uuidv4(),
    name,
    email,
    entries: 0,
    joined: new Date()
  });
  res.json(database.users[database.users.length - 1]);
});
