/**
 * Error-handling middleware
 * -------------------------
 * Express only treats a function as error middleware when it has
 * four arguments: (err, req, res, next).
 *
 * This is the last middleware registered in app.js.
 * Controllers call next(error) or throw AppError; this file
 * turns that into a consistent JSON response.
 */
const AppError = require("../utils/AppError");

function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
}

function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    error: statusCode === 500 && isProduction ? "Internal server error" : err.message,
    ...(err.errors ? { errors: err.errors } : {}),
  });
}

module.exports = {
  notFound,
  errorHandler,
};
