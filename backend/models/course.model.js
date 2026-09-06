/**
 * Course model
 * ------------
 * SQL for the existing courses table: id, name, description, price, created_at.
 * Services call these functions; they do not run queries themselves.
 */
const pool = require("../config/database");

async function findAll() {
  const result = await pool.query("SELECT * FROM courses ORDER BY id");
  return result.rows;
}

async function findById(id) {
  const result = await pool.query("SELECT * FROM courses WHERE id = $1", [id]);
  return result.rows[0] || null;
}

async function create({ name, description, price }) {
  const result = await pool.query(
    `INSERT INTO courses (name, description, price)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, description, price]
  );

  return result.rows[0];
}

async function update(id, { name, description, price }) {
  const current = await findById(id);

  if (!current) {
    return null;
  }

  const result = await pool.query(
    `UPDATE courses
     SET name = $1, description = $2, price = $3
     WHERE id = $4
     RETURNING *`,
    [
      name !== undefined ? name : current.name,
      description !== undefined ? description : current.description,
      price !== undefined ? price : current.price,
      id,
    ]
  );

  return result.rows[0];
}

async function remove(id) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM user_courses WHERE course_id = $1", [id]);
    const result = await client.query(
      "DELETE FROM courses WHERE id = $1 RETURNING *",
      [id]
    );
    await client.query("COMMIT");
    return result.rows[0] || null;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
