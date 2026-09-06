/**
 * Course validators
 * -----------------
 * Matches the existing courses table: name, description, price.
 */
function validateCreateCourse(body) {
  const errors = [];
  const { name, description, price } = body;

  if (!name || String(name).trim().length < 2) {
    errors.push("Course name must be at least 2 characters.");
  }

  if (description !== undefined && description !== null && String(description).length > 1000) {
    errors.push("Course description must be 1000 characters or fewer.");
  }

  if (price === undefined || price === null || price === "") {
    errors.push("Course price is required.");
  } else if (Number.isNaN(Number(price)) || Number(price) < 0) {
    errors.push("Course price must be a number greater than or equal to 0.");
  }

  return errors;
}

function validateUpdateCourse(body, params) {
  const errors = [];

  if (!params.id || Number.isNaN(Number(params.id))) {
    errors.push("A valid course id is required.");
  }

  if (body.name !== undefined && String(body.name).trim().length < 2) {
    errors.push("Course name must be at least 2 characters.");
  }

  if (body.description !== undefined && body.description !== null && String(body.description).length > 1000) {
    errors.push("Course description must be 1000 characters or fewer.");
  }

  if (body.price !== undefined && (Number.isNaN(Number(body.price)) || Number(body.price) < 0)) {
    errors.push("Course price must be a number greater than or equal to 0.");
  }

  if (body.name === undefined && body.description === undefined && body.price === undefined) {
    errors.push("Provide at least one field to update: name, description, or price.");
  }

  return errors;
}

function validateCourseId(body, params) {
  const errors = [];

  if (!params.id || Number.isNaN(Number(params.id))) {
    errors.push("A valid course id is required.");
  }

  return errors;
}

module.exports = {
  validateCreateCourse,
  validateUpdateCourse,
  validateCourseId,
};
