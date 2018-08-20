const express = require("express")
const modelsRouter = express.Router({ mergeParams: true })
const mongoose = require("mongoose")
const { createModel } = require("../utils/dynamicSchema")
const { Project } = require("../models/Project")
const { UserCreatedModel } = require("../models/UserCreatedModel")
const User = require("../models/User")

const { isOwner } = require("../utils/middleware")
const { UnexpectedRoutingError } = require("../utils/errorHandling")

const documentsRouter = require("./documentsRouter")

modelsRouter.use("/:modelId/documents", documentsRouter)

modelsRouter.get("/", async (req, res) => {
  try {
    const { models } = await Project.findOne(
      { _id: req.params.projectId },
      { models: 1 }
    ).populate({ path: "models", model: UserCreatedModel })
    res.json({
      data: {
        models
      }
    })
  } catch (err) {
    UnexpectedRoutingError(err, req, res)
  }
})

modelsRouter.get("/:modelId", async (req, res) => {
  try {
    const model = await UserCreatedModel.findOne({
      _id: req.params.modelId
    })
    res.json({
      data: {
        model
      }
    })
  } catch (err) {
    UnexpectedRoutingError(err, req, res)
  }
})

modelsRouter.post("/add", isOwner, async (req, res) => {
  try {
    const modelId = new mongoose.Types.ObjectId()

    const { fields, ...body } = req.body
    // const parsedFields = JSON.parse(fields)
    parsedFields.push(["owner", "ObjectId", { required: true }])
    parsedFields.push(["project", "ObjectId", { required: true }])
    parsedFields.push(["model", "ObjectId", { required: true }])
    const newFields = JSON.stringify(parsedFields)

    await Promise.all([
      Project.findOneAndUpdate(
        { _id: req.params.projectId },
        {
          $push: { models: modelId }
        }
      ),
      new UserCreatedModel({
        ...body,
        fields: newFields,
        owner: req.session.passport.user,
        project: req.params.projectId,
        _id: modelId
      }).save()
    ])
    const newModel = await UserCreatedModel.findOne({ _id: modelId })
    res.json({
      data: {
        model: newModel
      }
    })
  } catch (err) {
    UnexpectedRoutingError(err, req, res)
  }
})

module.exports = modelsRouter
