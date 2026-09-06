/**
 * User service
 * ------------
 * Business rules live here. This layer does not send HTTP responses
 * and does not write raw SQL — it calls the user model.
 *
 * Controller → Service → Model
 */
const userModel = require("../models/user.model");
const courseModel = require("../models/course.model");
const AppError = require("../utils/AppError");

async function assertCoursesExist(courseIds = []) {
  if (!courseIds.length) {
    return;
  }

  const courses = await courseModel.findAll();
  const validIds = new Set(courses.map((course) => Number(course.id)));
  const missing = courseIds.filter((id) => !validIds.has(Number(id)));

  if (missing.length > 0) {
    throw new AppError(`Unknown course id(s): ${missing.join(", ")}`, 400);
  }
}

function handleUniqueEmail(error) {
  if (error.code === "23505") {
    throw new AppError("A user with that email already exists.", 409);
  }

  throw error;
}

async function getUsers() {
  return userModel.findAll();
}

async function getUserById(id) {
  const user = await userModel.findById(id);

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return user;
}

async function createUser({ name, email, password, courseIds = [] }) {
  await assertCoursesExist(courseIds);

  try {
    const user = await userModel.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password,
      courseIds: courseIds.map(Number),
    });

    const withCourses = await userModel.findById(user.id);
    return withCourses || user;
  } catch (error) {
    handleUniqueEmail(error);
  }
}

async function updateUser(id, { name, email, courseIds }) {
  await getUserById(id);

  if (courseIds !== undefined) {
    await assertCoursesExist(courseIds);
  }

  try {
    await userModel.update(id, {
      name: name !== undefined ? String(name).trim() : undefined,
      email: email !== undefined ? String(email).trim().toLowerCase() : undefined,
      courseIds: courseIds !== undefined ? courseIds.map(Number) : undefined,
    });

    return userModel.findById(id);
  } catch (error) {
    handleUniqueEmail(error);
  }
}

async function deleteUser(id) {
  const deleted = await userModel.remove(id);

  if (!deleted) {
    throw new AppError("User not found.", 404);
  }

  return deleted;
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
