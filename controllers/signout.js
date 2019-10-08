const { redisClient } = require("./signin");
const handleSignout = (req, res) => {
  const { authorization } = req.headers;
  return delToken(authorization)
    .then(() => res.json("success"))
    .catch(err => {
      console.log({ err });
      res.status(400).json({ err });
    });
};

const delToken = key => {
  return Promise.resolve(redisClient.del(key));
};

module.exports = {
  handleSignout: handleSignout
};
