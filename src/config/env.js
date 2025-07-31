require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  wsPath: process.env.WS_PATH || "/ws",
  authToken: process.env.AUTH_TOKEN,
};
