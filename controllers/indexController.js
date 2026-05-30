const db = require("../db/queries");

async function getPostsFromDb(req, res) {
  try {
    const posts = await db.getPosts();
    res.render("index", { posts });
  } catch (error) {
    console.error(`getPostsFromDb failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getPostsFromDb,
};
