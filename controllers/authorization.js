const { redisClient } = require("./signin");

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json("Unathorized");
  return redisClient.get(authorization, (err, reply) =>
    err || !reply ? res.status(401).json("Unathorized") : next()
  );
};

module.exports = {
  requireAuth: requireAuth
};
