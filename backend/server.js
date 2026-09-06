const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running!"
  });
});


// =========================
// TEST DATABASE
// =========================

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connected!",
      time: result.rows[0].now
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Database connection failed"
    });
  }
});


// =========================
// GET USERS
// =========================

app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         u.id,
         u.name,
         u.email,
         u.course_id,
         c.name AS course_name,
         c.price AS course_price
       FROM users u
       LEFT JOIN courses c
         ON u.course_id = c.id
       ORDER BY u.id`
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch users"
    });
  }
});


// =========================
// GET COURSES
// =========================

app.get("/api/courses", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM courses ORDER BY id"
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch courses"
    });
  }
});


// =========================
// GET COURSE USERS
// =========================

app.get("/api/courses/:courseId/users", async (req, res) => {
  const { courseId } = req.params;

  try {
    // Get the course
    const courseResult = await pool.query(
      `SELECT id, name, description, price
       FROM courses
       WHERE id = $1`,
      [courseId]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({
        error: "Course not found"
      });
    }

    // Get users enrolled in this course
    const usersResult = await pool.query(
      `SELECT
          u.id,
          u.name,
          u.email
       FROM users u
       WHERE u.course_id = $1
       ORDER BY u.id`,
      [courseId]
    );

    res.json({
      course: courseResult.rows[0],
      users: usersResult.rows
    });

  } catch (error) {
    console.error("Error fetching course users:", error);

    res.status(500).json({
      error: "Failed to fetch users for this course"
    });
  }
});


// =========================
// CREATE USER
// =========================

app.post("/api/users", async (req, res) => {
  const { name, email, courseId } = req.body;

  if (!name || !email || courseId == null || courseId === "") {
    return res.status(400).json({
      error: "Name, email, and courseId are required"
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, course_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name.trim(), email.trim(), courseId]
    );

    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Error creating user:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "A user with this email already exists"
      });
    }

    if (error.code === "23503") {
      return res.status(400).json({
        error: "Selected course does not exist"
      });
    }

    res.status(500).json({
      error: "Failed to create user"
    });
  }
});


// =========================
// DELETE USER
// =========================

app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    res.json({
      message: "User deleted successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Error deleting user:", error);

    res.status(500).json({
      error: "Failed to delete user"
    });
  }
});


// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
