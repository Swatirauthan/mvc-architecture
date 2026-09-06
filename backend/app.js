/**
 * Express application
 * -------------------
 * Builds the app: global middleware, route mounting, error handlers.
 * server.js is the only file that calls listen().
 *
 * Request lifecycle:
 *   React → HTTP → app.js middleware → Route → Route middleware
 *   → Controller → Service → Model → PostgreSQL
 */
const express = require("express");
const cors = require("cors");

const pool = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const courseRoutes = require("./routes/course.routes");
const { notFound, errorHandler } = require("./middleware/error.middleware");
const asyncHandler = require("./utils/asyncHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running!",
  });
});

app.get(
  "/api/test-db",
  asyncHandler(async (req, res) => {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected!",
      time: result.rows[0].now,
    });
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
