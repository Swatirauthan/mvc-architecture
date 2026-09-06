/**
 * AppError
 * --------
 * A small Error subclass so the error middleware can tell the
 * difference between an expected HTTP error (400, 401, 404)
 * and an unexpected crash (500).
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}

module.exports = AppError;
