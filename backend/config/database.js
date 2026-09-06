/**
 * Database configuration
 * ----------------------
 * Creates a single PostgreSQL connection pool used by the model layer.
 * Controllers and services should never create their own connections.
 *
 * Environment variables live in backend/.env (see .env.example).
 */
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error:", error);
});

module.exports = pool;
