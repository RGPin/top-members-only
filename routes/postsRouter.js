const express = require("express");
const controller = require("../controllers/postsController");
const postsRouter = express.Router();

postsRouter.get("/new", controller.getCreatePostForm);
postsRouter.post("/new", controller.postCreatePostForm);
postsRouter.get("/:id", controller.getPostDetails);

module.exports = postsRouter;
