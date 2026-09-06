/**
 * User validators
 * ---------------
 * Pure functions: input in, error messages out.
 * They do not talk to Express or PostgreSQL.
 */
function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validateCreateUser(body) {
  const errors = [];
  const { name, email, courseIds } = body;

  if (!name || String(name).trim().length < 2) {
    errors.push("Name must be at least 2 characters.");
  }

  if (!isValidEmail(email)) {
    errors.push("A valid email address is required.");
  }

  if (courseIds !== undefined && !Array.isArray(courseIds)) {
    errors.push("courseIds must be an array of course ids.");
  }

  return errors;
}

function validateUpdateUser(body, params) {
  const errors = [];

  if (!params.id || Number.isNaN(Number(params.id))) {
    errors.push("A valid user id is required.");
  }

  if (body.name !== undefined && String(body.name).trim().length < 2) {
    errors.push("Name must be at least 2 characters.");
  }

  if (body.email !== undefined && !isValidEmail(body.email)) {
    errors.push("A valid email address is required.");
  }

  if (body.courseIds !== undefined && !Array.isArray(body.courseIds)) {
    errors.push("courseIds must be an array of course ids.");
  }

  if (
    body.name === undefined &&
    body.email === undefined &&
    body.courseIds === undefined
  ) {
    errors.push("Provide at least one field to update: name, email, or courseIds.");
  }

  return errors;
}

function validateUserId(body, params) {
  const errors = [];

  if (!params.id || Number.isNaN(Number(params.id))) {
    errors.push("A valid user id is required.");
  }

  return errors;
}

module.exports = {
  isValidEmail,
  validateCreateUser,
  validateUpdateUser,
  validateUserId,
};
