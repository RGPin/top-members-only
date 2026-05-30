const express = require("express");
const controller = require("../controllers/indexController");
const indexRouter = express.Router();

indexRouter.get("/", controller.getPostsFromDb);
indexRouter.get("/login", controller.getLoginForm);
indexRouter.post("/login", controller.postLoginForm);
indexRouter.get("/logout", controller.postLogout);

module.exports = indexRouter;
