const pool = require("./pool");

async function findUserById(id) {
  const userId = Number(id);
  if (isNaN(userId)) {
    throw new Error(`findUserById failed: id must be number.`);
  }
  try {
    const { rows } = await pool.query(
      `
      SELECT * FROM users
      WHERE id = $1
      `,
      [userId],
    );
    return rows[0] || null;
  } catch (error) {
    console.error(`findUserById failed: ${error.message}`);
    throw new Error(`findUserById failed: ${error.message}`, {
      cause: error,
    });
  }
}

async function findUserByUsername(username) {
  if (typeof username !== "string") {
    throw new Error(`findUserByUsername failed: username must be string.`);
  }
  try {
    const { rows } = await pool.query(
      `
      SELECT * FROM users
      WHERE username = $1
      `,
      [username],
    );
    return rows[0] || null;
  } catch (error) {
    console.error(`findUserByUsername failed: ${error.message}`);
    throw new Error(`findUserByUsername failed: ${error.message}`, {
      cause: error,
    });
  }
}

module.exports = {
  findUserById,
  findUserByUsername,
};
