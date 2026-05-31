const express = require("express");
const controller = require("../controllers/indexController");
const indexRouter = express.Router();

indexRouter.get("/", controller.getPostsFromDb);
indexRouter.get("/login", controller.getLoginForm);
indexRouter.post("/login", controller.postLoginForm);
indexRouter.get("/logout", controller.postLogout);
indexRouter.get("/signup", controller.getSignUpForm);
indexRouter.post("/signup", controller.postSignUpForm);

module.exports = indexRouter;
