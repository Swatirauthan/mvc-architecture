/**
 * One-time / repeatable database setup.
 * Adds missing columns for auth without wiping existing rows.
 *
 * Usage (from the backend folder):
 *   npm run init-db
 */
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pool = require("../config/database");

async function init() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await pool.query(schema);

  const existing = await pool.query("SELECT COUNT(*)::int AS count FROM courses");

  if (existing.rows[0].count === 0) {
    await pool.query(
      `INSERT INTO courses (name, description, price) VALUES
        ('React Fundamentals', 'Build user interfaces with components and hooks.', 4999),
        ('Node.js & Express', 'Create HTTP APIs with routes and middleware.', 5999),
        ('PostgreSQL Essentials', 'Store application data in relational tables.', 3999)`
    );
    console.log("Seeded sample courses.");
  } else {
    console.log("Courses table already has rows; skipped seed.");
  }

  console.log("Database schema is ready.");
}

init()
  .catch((error) => {
    console.error("Failed to initialize database:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
