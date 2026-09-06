/**
 * User model
 * ----------
 * The only layer that writes SQL for the users and user_courses tables.
 * Services call these functions; they do not run queries themselves.
 *
 * Existing schema (preserved):
 *   users(id, name, email, created_at, [password])
 *   user_courses(user_id, course_id)
 */
const pool = require("../config/database");

function stripPassword(row) {
  if (!row) return row;
  const { password, ...safeUser } = row;
  return safeUser;
}

async function findAll() {
  const result = await pool.query(
    `SELECT
       u.id,
       u.name,
       u.email,
       u.created_at,
       COALESCE(
         json_agg(
           json_build_object(
             'id', c.id,
             'name', c.name,
             'description', c.description,
             'price', c.price
           )
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

  return result.rows;
}

async function findById(id) {
  const result = await pool.query(
    `SELECT
       u.id,
       u.name,
       u.email,
       u.created_at,
       COALESCE(
         json_agg(
           json_build_object(
             'id', c.id,
             'name', c.name,
             'description', c.description,
             'price', c.price
           )
           ORDER BY c.id
         ) FILTER (WHERE c.id IS NOT NULL),
         '[]'
       ) AS courses
     FROM users u
     LEFT JOIN user_courses uc ON uc.user_id = u.id
     LEFT JOIN courses c ON c.id = uc.course_id
     WHERE u.id = $1
     GROUP BY u.id`,
    [id]
  );

  return result.rows[0] || null;
}

async function findByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0] || null;
}

async function create({ name, email, password, courseIds = [] }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = password
      ? await client.query(
          `INSERT INTO users (name, email, password)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [name, email, password]
        )
      : await client.query(
          `INSERT INTO users (name, email)
           VALUES ($1, $2)
           RETURNING *`,
          [name, email]
        );

    const user = userResult.rows[0];

    for (const courseId of courseIds) {
      await client.query(
        `INSERT INTO user_courses (user_id, course_id)
         VALUES ($1, $2)`,
        [user.id, courseId]
      );
    }

    await client.query("COMMIT");
    return stripPassword(user);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function update(id, { name, email, courseIds }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const current = await client.query("SELECT * FROM users WHERE id = $1", [id]);

    if (current.rowCount === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    const nextName = name !== undefined ? name : current.rows[0].name;
    const nextEmail = email !== undefined ? email : current.rows[0].email;

    const updated = await client.query(
      `UPDATE users
       SET name = $1, email = $2
       WHERE id = $3
       RETURNING *`,
      [nextName, nextEmail, id]
    );

    if (courseIds !== undefined) {
      await client.query("DELETE FROM user_courses WHERE user_id = $1", [id]);

      for (const courseId of courseIds) {
        await client.query(
          `INSERT INTO user_courses (user_id, course_id)
           VALUES ($1, $2)`,
          [id, courseId]
        );
      }
    }

    await client.query("COMMIT");
    return stripPassword(updated.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function remove(id) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM user_courses WHERE user_id = $1", [id]);
    const result = await client.query(
      "DELETE FROM users WHERE id = $1 RETURNING id, name, email",
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
  findByEmail,
  create,
  update,
  remove,
};
