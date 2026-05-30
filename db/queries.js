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

async function getPostDetailById(id) {
  const postId = Number(id);
  if (isNaN(postId)) {
    throw new TypeError(`getPostDetailById failed: id must be number`);
  }
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
      WHERE posts.id = $1
      `,
      [postId],
    );
    return rows[0] || null;
  } catch (error) {
    console.error(`getPostDetailById failed: ${error.message}`);
    throw new Error(`getPostDetailById failed: ${error.message}`, {
      cause: error,
    });
  }
}

module.exports = {
  getPosts,
  getPostDetailById,
};
