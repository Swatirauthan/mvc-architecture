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
         COALESCE(
           json_agg(
             json_build_object('id', c.id, 'name', c.name, 'price', c.price)
             ORDER BY c.id
           ) FILTER (WHERE c.id IS NOT NULL),
           '[]'
         ) AS courses
       FROM users u
       LEFT JOIN user_courses uc ON uc.user_id = u.id
       LEFT JOIN courses c ON c.id = uc.course_id
       GROUP BY u.id
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
// CREATE USER
// =========================

app.post("/api/users", async (req, res) => {

  const { name, email, courseIds = [] } = req.body;

  console.log("Received data:", req.body);

  try {

    // Insert user
    const userResult = await pool.query(
      `INSERT INTO users (name, email)
       VALUES ($1, $2)
       RETURNING *`,
      [name, email]
    );

    const user = userResult.rows[0];

    // Insert selected courses
    for (const courseId of courseIds) {

      await pool.query(
        `INSERT INTO user_courses (user_id, course_id)
         VALUES ($1, $2)`,
        [user.id, courseId]
      );

    }

    res.status(201).json({
      message: "User created successfully",
      user: user,
      courseIds: courseIds
    });

  } catch (error) {

    console.error("Error creating user:", error);

    res.status(500).json({
      error: "Failed to create user"
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
