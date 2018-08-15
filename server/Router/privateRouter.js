const express = require("express")
const privateRouter = express.Router()

const projectsRouter = require("./projectsRouter")

privateRouter.use("/:user/projects", projectsRouter)

module.exports = privateRouter
