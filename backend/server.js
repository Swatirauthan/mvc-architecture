/**
 * Server entry point
 * ------------------
 * Loads environment variables and starts listening.
 * Application setup lives in app.js so it can be tested
 * without opening a network port.
 */
require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
