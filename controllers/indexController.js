const db = require("../db/queries");
const passport = require("passport");
require("../config/passport")(passport);
const bcrypt = require("bcryptjs");

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

async function getSignUpForm(req, res) {
  try {
    if (req.user) return res.redirect("/");
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private",
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.render("signup");
  } catch (error) {
    console.error(`getSignUpForm failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

async function postSignUpForm(req, res) {
  try {
    const { firstname, lastname, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.addUser(
      firstname,
      lastname,
      username,
      hashedPassword,
    );
    if (!newUser) {
      return res.render("signup", {
        error: "Sign up failed. Please try again.",
      });
    }
    res.redirect("/login");
  } catch (error) {
    if (error.code === "23505") {
      return res.render("signup", {
        error: "Username already taken. Please try another",
      });
    }
    console.error(`postSignUpForm failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getPostsFromDb,
  getLoginForm,
  postLoginForm,
  postLogout,
  getSignUpForm,
  postSignUpForm,
};
