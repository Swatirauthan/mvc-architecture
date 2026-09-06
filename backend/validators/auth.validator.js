/**
 * Auth validators
 * ---------------
 */
const { isValidEmail } = require("./user.validator");

function validateRegister(body) {
  const errors = [];
  const { name, email, password } = body;

  if (!name || String(name).trim().length < 2) {
    errors.push("Name must be at least 2 characters.");
  }

  if (!isValidEmail(email)) {
    errors.push("A valid email address is required.");
  }

  if (!password || String(password).length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  return errors;
}

function validateLogin(body) {
  const errors = [];
  const { email, password } = body;

  if (!isValidEmail(email)) {
    errors.push("A valid email address is required.");
  }

  if (!password) {
    errors.push("Password is required.");
  }

  return errors;
}

module.exports = {
  validateRegister,
  validateLogin,
};
