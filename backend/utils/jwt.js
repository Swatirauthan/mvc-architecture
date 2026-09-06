/**
 * JWT helpers
 * -----------
 * Shared by the auth service (creates tokens) and the
 * auth middleware (verifies tokens).
 */
const jwt = require("jsonwebtoken");

const TOKEN_EXPIRES_IN = "7d";

function getJwtSecret() {
  return process.env.JWT_SECRET || "dev-secret-change-me";
}

function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: TOKEN_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

module.exports = {
  getJwtSecret,
  signToken,
  verifyToken,
};
