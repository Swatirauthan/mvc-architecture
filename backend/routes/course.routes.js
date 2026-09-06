/**
 * Course routes
 * -------------
 * Mounted at /api/courses in app.js
 *
 * GET stays public so the original registration form can load courses.
 * Create / update / delete require a JWT so students can see
 * authentication middleware in action.
 */
const express = require("express");
const courseController = require("../controllers/course.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  validateCreateCourse,
  validateUpdateCourse,
  validateCourseId,
} = require("../validators/course.validator");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(courseController.getCourses));

router.get(
  "/:id",
  validate(validateCourseId),
  asyncHandler(courseController.getCourseById)
);

router.post(
  "/",
  requireAuth,
  validate(validateCreateCourse),
  asyncHandler(courseController.createCourse)
);

router.put(
  "/:id",
  requireAuth,
  validate(validateUpdateCourse),
  asyncHandler(courseController.updateCourse)
);

router.delete(
  "/:id",
  requireAuth,
  validate(validateCourseId),
  asyncHandler(courseController.deleteCourse)
);

module.exports = router;
