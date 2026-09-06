/**
 * Auth service
 * ------------
 * Handles registration, password hashing, and JWT creation.
 * Password hashes are never returned to the client.
 */
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const userService = require("./user.service");
const AppError = require("../utils/AppError");
const { signToken } = require("../utils/jwt");

const SALT_ROUNDS = 10;

function buildToken(user) {
  return signToken({ id: user.id, email: user.email, name: user.name });
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    courses: user.courses || [],
  };
}

async function register({ name, email, password }) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await userService.createUser({
    name,
    email,
    password: hashedPassword,
    courseIds: [],
  });

  return {
    message: "Registered successfully",
    user: toPublicUser(user),
    token: buildToken(user),
  };
}

async function login({ email, password }) {
  const user = await userModel.findByEmail(String(email).trim().toLowerCase());

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (!user.password) {
    throw new AppError(
      "This account has no password. Use /api/auth/register or create the user with a password.",
      400
    );
  }

  const matches = await bcrypt.compare(password, user.password);

  if (!matches) {
    throw new AppError("Invalid email or password.", 401);
  }

  const withCourses = await userModel.findById(user.id);
  const publicUser = toPublicUser(withCourses || user);

  return {
    message: "Logged in successfully",
    user: publicUser,
    token: buildToken(publicUser),
  };
}

module.exports = {
  register,
  login,
};
