/**
 * Validation middleware factory
 * -----------------------------
 * Takes a validator function (from /validators) and turns it
 * into Express middleware.
 *
 * The validator receives (body, params) and returns an array
 * of error strings. An empty array means the request is valid.
 *
 * Flow:
 *   Route → validate(validator) → Controller
 */
const AppError = require("../utils/AppError");

function validate(validatorFn) {
  return (req, res, next) => {
    const errors = validatorFn(req.body || {}, req.params || {});

    if (errors.length > 0) {
      const error = new AppError(errors[0], 400);
      error.errors = errors;
      return next(error);
    }

    next();
  };
}

module.exports = {
  validate,
};
