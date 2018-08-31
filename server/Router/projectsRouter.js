const express = require("express")
const mongoose = require("mongoose")
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
    const project = await Project.findOne({
      _id: req.params.projectId
    }).populate({
      path: "models",
      model: UserCreatedModel
    })
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
    console.log(`/projects/add req`, req.body)
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

projectsRouter.delete("/:projectId/delete", isOwner, async (req, res) => {
  try {
    const userCreatedModels = await UserCreatedModel.find({
      project: req.params.projectId
    })
    for (const userCreatedModel of userCreatedModels) {
      const { name, fields, options } = userCreatedModel
      const Model = createModel(name, fields, options)
      await Model.deleteMany({ project: req.params.projectId })
      const modelName = Model.modelName
      delete mongoose.models[modelName]
      delete mongoose.modelSchemas[modelName]
    }
    await UserCreatedModel.deleteMany({ project: req.params.projectId })
    await Project.findByIdAndRemove({ _id: req.params.projectId })
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $pull: { projects: req.params.projectId }
      }
    )
    res.status(200).json({
      data: {
        message: "Project, related models and documents have been deleted."
      }
    })
  } catch (err) {
    UnexpectedRoutingError(err, req, res)
  }
})

module.exports = projectsRouter
