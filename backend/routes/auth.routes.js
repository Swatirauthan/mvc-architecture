/**
 * Auth routes
 * -----------
 * Mounted at /api/auth in app.js
 */
const express = require("express");
const authController = require("../controllers/auth.controller");
const { requireAuth } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const { validateRegister, validateLogin } = require("../validators/auth.validator");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post(
  "/register",
  validate(validateRegister),
  asyncHandler(authController.register)
);

router.post(
  "/login",
  validate(validateLogin),
  asyncHandler(authController.login)
);

router.get("/me", requireAuth, asyncHandler(authController.me));

module.exports = router;
