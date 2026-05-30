const pool = require("./pool");

async function getPosts() {
  try {
    const { rows } = await pool.query(
      `
      SELECT 
        posts.id, 
        posts.content, 
        posts.created_at,
        users.username,
        users.firstname,
        users.lastname
      FROM posts
      INNER JOIN users ON posts.user_id = users.id
      ORDER BY posts.created_at DESC
      LIMIT 5;
      `,
    );
    return rows;
  } catch (error) {
    console.error(`getPosts failed: ${error.message}`);
    throw new Error(`getPosts failed: ${error.message}`, {
      cause: error,
    });
  }
}

module.exports = {
  getPosts,
};
