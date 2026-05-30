const db = require("../db/queries");
const passport = require("passport");
require("../config/passport")(passport);

async function getPostsFromDb(req, res) {
  try {
    const posts = await db.getPosts();
    const stylizedPosts = !req.user
      ? posts.map(({ username, firstname, lastname, ...postSafe }) => postSafe)
      : posts;
    res.render("index", { posts: stylizedPosts });
  } catch (error) {
    console.error(`getPostsFromDb failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

async function getLoginForm(req, res) {
  try {
    if (req.user) return res.redirect("/");
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private",
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.render("login");
  } catch (error) {
    console.error(`getLoginForm failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

async function postLoginForm(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.render("login", { error: info.message });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
}

async function postLogout(req, res, next) {
  req.logOut((err) => {
    if (err) next(err);
    res.redirect("/");
  });
}

module.exports = {
  getPostsFromDb,
  getLoginForm,
  postLoginForm,
  postLogout,
};
