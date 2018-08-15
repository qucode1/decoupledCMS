const express = require("express")
const projectsRouter = express.Router({ mergeParams: true })

const { createModel } = require("../utils/dynamicSchema")
const { Project } = require("../models/Project")
const { UserCreatedModel } = require("../models/UserCreatedModel")
const User = require("../models/User")

const { isOwner } = require("../utils/middleware")
const {
  AuthorizationError,
  UnexpectedRoutingError
} = require("../utils/errorHandling")

const modelsRouter = require("./modelsRouter")

projectsRouter.use("/:projectId/models", modelsRouter)

projectsRouter.get("/", async (req, res) => {
  try {
    const { projects } = await User.findOne(
      { _id: req.params.user },
      { projects: 1 }
    ).populate({ path: "projects", model: Project })
    res.json({
      data: {
        projects
      }
    })
  } catch (err) {
    UnexpectedRoutingError(err, req, res)
  }
})

projectsRouter.get("/:projectId", isOwner, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId })
    res.json({
      data: {
        project
      }
    })
  } catch (err) {
    UnexpectedRoutingError(err, req, res)
  }
})

projectsRouter.patch("/:projectId", isOwner, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId })
    if (project.owner === req.params.user) {
      const updatedProject = {
        ...project,
        ...req.body,
        _id: project._id
      }
      const savedProject = await updatedProject.save()
      res.json({
        data: {
          project: savedProject
        }
      })
    } else {
      AuthorizationError(res)
    }
  } catch (err) {
    UnexpectedRoutingError(err, req, res)
  }
})

projectsRouter.post("/add", isOwner, async (req, res) => {
  try {
    const projectId = new mongoose.Types.ObjectId()
    await Promise.all([
      User.findOneAndUpdate(
        { _id: req.params.user },
        {
          $push: { projects: projectId }
        }
      ),
      new Project({
        _id: projectId,
        owner: req.session.passport.user,
        name: req.body.name
      }).save()
    ])
    const newProject = await Project.findOne({ _id: projectId })
    res.json({
      data: {
        project: newProject
      }
    })
  } catch (err) {
    UnexpectedRoutingError(err, req, res)
  }
})

module.exports = projectsRouter
