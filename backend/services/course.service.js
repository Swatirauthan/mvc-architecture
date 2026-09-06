/**
 * Course service
 * --------------
 * Business rules for courses. SQL stays in the model.
 *
 * Controller → Service → Model
 */
const courseModel = require("../models/course.model");
const AppError = require("../utils/AppError");

async function getCourses() {
  return courseModel.findAll();
}

async function getCourseById(id) {
  const course = await courseModel.findById(id);

  if (!course) {
    throw new AppError("Course not found.", 404);
  }

  return course;
}

async function createCourse({ name, description, price }) {
  return courseModel.create({
    name: String(name).trim(),
    description: description !== undefined ? String(description).trim() : "",
    price: Number(price),
  });
}

async function updateCourse(id, { name, description, price }) {
  await getCourseById(id);

  return courseModel.update(id, {
    name: name !== undefined ? String(name).trim() : undefined,
    description: description !== undefined ? String(description).trim() : undefined,
    price: price !== undefined ? Number(price) : undefined,
  });
}

async function deleteCourse(id) {
  const deleted = await courseModel.remove(id);

  if (!deleted) {
    throw new AppError("Course not found.", 404);
  }

  return deleted;
}

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
