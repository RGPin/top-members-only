const db = require("../db/queries");

async function getPostDetails(req, res) {
  try {
    const post = await db.getPostDetailById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .send("<h1>404: Post Not Found</h1><a href='/'>Back to home</a>");
    }

    const stylizedPost = !req.user
      ? (({ username, lastname, firstname, ...postSafe }) => postSafe)(post)
      : post;
    res.render("postDetails", { post: stylizedPost });
  } catch (error) {
    console.error(`getPostDetails failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getPostDetails,
};
