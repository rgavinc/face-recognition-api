const express = require("express");
const bodyParser = require("body-parser");
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "1234",
    database: "smart-brain"
  }
});

console.log(process.env.THING);

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});

app.get("/", (req, res) => {
  res.send("welcome home");
});

app.get("/profile/:id", profile.handleProfileGet(db));

app.put("/image", image.handleImage(db));

app.post("/signin", signin.handleSignin(db, bcrypt));

app.post("/register", register.handleRegister(db, bcrypt));

app.post("/imageurl", image.handleApiCall());
