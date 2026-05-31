const express = require("express");
const controller = require("../controllers/postsController");
const postsRouter = express.Router();

postsRouter.get("/new", controller.getCreatePostForm);
postsRouter.get("/:id", controller.getPostDetails);

module.exports = postsRouter;
