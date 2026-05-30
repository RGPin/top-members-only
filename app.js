const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")(passport);

const app = express();
const indexRouter = require("./routes/indexRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);
app.use(passport.session());

app.use("/", indexRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, (error) => {
  if (error) {
    console.error(error);
    throw error;
  }
  console.log(`Listening to port ${PORT}...`);
});
