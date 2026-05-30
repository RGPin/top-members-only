const express = require("express");
const controller = require("../controllers/postsController");
const postsRouter = express.Router();

postsRouter.get("/:id", controller.getPostDetails);

module.exports = postsRouter;
