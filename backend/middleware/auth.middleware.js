/**
 * Authentication middleware
 * -------------------------
 * Runs AFTER the request hits a route and BEFORE the controller.
 *
 * Flow:
 *   Route → requireAuth → Controller
 *
 * Reads `Authorization: Bearer <jwt>` and attaches the decoded
 * user payload to req.user so controllers can use it.
 */
const { verifyToken } = require("../utils/jwt");
const AppError = require("../utils/AppError");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return next(new AppError("Authentication required. Send a Bearer token.", 401));
  }

  const token = header.slice("Bearer ".length).trim();

  if (!token) {
    return next(new AppError("Authentication required. Send a Bearer token.", 401));
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token.", 401));
  }
}

module.exports = {
  requireAuth,
};
