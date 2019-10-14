const Clarifai = require("clarifai");
const { CLARIFAI_KEY } = require("../utils/secure-vars");

//You must add your own API key here from Clarifai.
const app = new Clarifai.App({
  apiKey: CLARIFAI_KEY
});

const handleApiCall = (req, res) => {
  console.log("in handle api");
  console.log(app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input));
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => {
      return res.status(400).json({ error: err.statusText });
    });
};

const handleImage = (req, res, db) => {
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
