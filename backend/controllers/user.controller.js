/**
 * User controller
 * ---------------
 * Translates HTTP into service calls and sends the JSON response.
 * No SQL and no business rules here.
 *
 * Route → Middleware → Controller → Service
 */
const userService = require("../services/user.service");

async function getUsers(req, res) {
  const users = await userService.getUsers();
  res.json(users);
}

async function getUserById(req, res) {
  const user = await userService.getUserById(req.params.id);
  res.json(user);
}

async function createUser(req, res) {
  const { name, email, courseIds } = req.body;
  const user = await userService.createUser({
    name,
    email,
    courseIds: courseIds || [],
  });

  // Preserve the original POST /api/users response shape.
  res.status(201).json({
    message: "User created successfully",
    user,
    courseIds: courseIds || [],
  });
}

async function updateUser(req, res) {
  const user = await userService.updateUser(req.params.id, req.body);
  res.json({
    message: "User updated successfully",
    user,
  });
}

async function deleteUser(req, res) {
  const user = await userService.deleteUser(req.params.id);
  res.json({
    message: "User deleted successfully",
    user,
  });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
