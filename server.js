const express = require("express");
const bodyParser = require("body-parser");
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "1234",
    database: "smart-brain"
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

// app.get("/", (req, res) => {
//   res.send(database.users);
// });

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then(user => {
      if (user.length) res.json(user[0]);
      res.status(400).json("Not Found");
    })
    .catch(err => res.status(400).json("Error getting user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("Unable to get entriesr"));
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  db.select("email", "hash")
    .from("login")
    .where({ email })
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where({ email })
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json("unable to get user"));
      }
      res.status(400).json("wrong credentials");
    })
    .catch(err => res.status(400).json("wrong credentials"));
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx
      .insert({
        hash,
        email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            email,
            name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json("unable to register"));
  bcrypt.hash(password, null, null, function(err, hash) {});
});
