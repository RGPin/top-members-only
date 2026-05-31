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

async function getCreatePostForm(req, res) {
  try {
    if (!req.user) return res.redirect("/login");
    res.render("createPost");
  } catch (error) {
    console.error(`getCreatePostForm failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

async function postCreatePostForm(req, res) {
  try {
    const { content, user_id } = req.body;
    if (content.length > 280) {
      return res.render("createPost", {
        error: "Exceeded max character count",
      });
    }
    const newPost = await db.addPost(content, user_id);
    if (!newPost) {
      return res.render("createPost", {
        error: "Post failed. Please try again.",
      });
    }
    res.redirect("/");
  } catch (error) {
    console.error(`postCreatePostForm failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

async function postDeletePost(req, res) {
  try {
    const deletedPost = await db.deletePostById(req.params.id);
    if (!deletedPost) {
      alert("Failed to delete post. My bad.");
    }
    res.redirect("/");
  } catch (error) {
    console.error(`postDeletePost failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getPostDetails,
  getCreatePostForm,
  postCreatePostForm,
  postDeletePost,
};
