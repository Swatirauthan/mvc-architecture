/**
 * User routes
 * -----------
 * Map HTTP methods + paths to middleware and controllers.
 * This file should stay easy to read: "what URL does what?"
 *
 * Mounted at /api/users in app.js
 */
const express = require("express");
const userController = require("../controllers/user.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  validateCreateUser,
  validateUpdateUser,
  validateUserId,
} = require("../validators/user.validator");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(userController.getUsers));

router.get(
  "/:id",
  validate(validateUserId),
  asyncHandler(userController.getUserById)
);

router.post(
  "/",
  validate(validateCreateUser),
  asyncHandler(userController.createUser)
);

router.put(
  "/:id",
  requireAuth,
  validate(validateUpdateUser),
  asyncHandler(userController.updateUser)
);

router.delete(
  "/:id",
  requireAuth,
  validate(validateUserId),
  asyncHandler(userController.deleteUser)
);

module.exports = router;
