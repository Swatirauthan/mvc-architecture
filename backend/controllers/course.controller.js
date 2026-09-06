/**
 * Course controller
 * -----------------
 * HTTP in, JSON out. Database work stays in the model.
 *
 * Route → Middleware → Controller → Service
 */
const courseService = require("../services/course.service");

async function getCourses(req, res) {
  const courses = await courseService.getCourses();
  res.json(courses);
}

async function getCourseById(req, res) {
  const course = await courseService.getCourseById(req.params.id);
  res.json(course);
}

async function createCourse(req, res) {
  const course = await courseService.createCourse(req.body);
  res.status(201).json({
    message: "Course created successfully",
    course,
  });
}

async function updateCourse(req, res) {
  const course = await courseService.updateCourse(req.params.id, req.body);
  res.json({
    message: "Course updated successfully",
    course,
  });
}

async function deleteCourse(req, res) {
  const course = await courseService.deleteCourse(req.params.id);
  res.json({
    message: "Course deleted successfully",
    course,
  });
}

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
