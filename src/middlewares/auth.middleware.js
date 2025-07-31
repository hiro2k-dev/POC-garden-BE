const { authToken } = require("../config/env");

function verifyToken(req, res, next) {
  const token = req.headers["x-api-token"];
  if (token === authToken) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = verifyToken;
