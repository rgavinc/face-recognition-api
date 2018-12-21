const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "f58db3e72129494cbe9650eb2e383c5e"
});

const handleApiCall = () => (req, res) =>
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => res.status(400).json("unable to work with api"));

const handleImage = db => (req, res) => {
  const { id } = req.body;
  db("users")
    .where({ id })
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("Unable to get entriesr"));
};

module.exports = {
  handleImage,
  handleApiCall
};
