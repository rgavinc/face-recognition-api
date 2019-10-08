const Clarifai = require("clarifai");
var constants = require("../env");
let apiKey = constants.CLARIFAI_KEY;

console.log(constants.CLARIFAI_KEY);

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
  apiKey
});

const handleApiCall = (req, res) => {
  console.log("in handle api");
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(err => res.status(400).json("unable to work with API"));
};

const handleImage = (req, res, db) => {
  console.log(constants.CLARIFAI_KEY);
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage,
  handleApiCall
};
