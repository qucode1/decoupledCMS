const express = require("express");
const privateRouter = express.Router();
const { isOwner } = require("../utils/middleware");
const projectsRouter = require("./projectsRouter");

// privateRouter.use(isOwner);
privateRouter.use("/:user/projects", projectsRouter);

module.exports = privateRouter;
