const express = require("express");
const mongoose = require("mongoose");
const projectsRouter = express.Router({ mergeParams: true });
const uuid = require("uuid/v4");

const { createModel } = require("../utils/dynamicSchema");
const { Project } = require("../models/Project");
const { Origin } = require("../models/Origin");
const { UserCreatedModel } = require("../models/UserCreatedModel");
const User = require("../models/User");

const { isOwner } = require("../utils/middleware");
const {
  AuthorizationError,
  UnexpectedRoutingError
} = require("../utils/errorHandling");

const modelsRouter = require("./modelsRouter");

projectsRouter.use("/:projectId/models", modelsRouter);

projectsRouter.get("/", async (req, res) => {
  try {
    const { projects } = await User.findOne(
      { _id: req.params.user },
      { projects: 1 }
    ).populate({ path: "projects", model: Project });
    res.json({
      data: {
        projects
      }
    });
  } catch (err) {
    UnexpectedRoutingError(err, req, res);
  }
});

projectsRouter.get("/:projectId", isOwner, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId
    })
      .populate({
        path: "models",
        model: UserCreatedModel
      })
      .populate({
        path: "validOrigins",
        model: Origin
      });
    res.json({
      data: {
        project
      }
    });
  } catch (err) {
    UnexpectedRoutingError(err, req, res);
  }
});

projectsRouter.put("/:projectId", isOwner, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId });
    if (project.owner.toString() === req.params.user) {
      Object.keys(req.body).forEach(key => {
        if (!["owner", "models"].includes(key)) {
          project[key] = req.body[key];
        }
      });
      const savedProject = await project.save();
      res.json({
        data: {
          project: savedProject
        }
      });
    } else {
      AuthorizationError(res);
    }
  } catch (err) {
    UnexpectedRoutingError(err, req, res);
  }
});

projectsRouter.post("/", isOwner, async (req, res) => {
  try {
    console.log(`/projects/add req`, req.body);
    const projectId = new mongoose.Types.ObjectId();
    const origins = req.body.validOrigins
      ? req.body.validOrigins.map(
          name =>
            new Origin({
              id: new mongoose.Types.ObjectId(),
              name: name,
              apiKey: uuid(),
              owner: req.session.passport.user
            })
        )
      : [];

    await Promise.all([
      User.findOneAndUpdate(
        { _id: req.params.user },
        {
          $push: { projects: projectId }
        }
      ),
      ...origins.map(async origin => {
        await origin.save();
      }),
      new Project({
        _id: projectId,
        owner: req.session.passport.user,
        name: `${req.body.name} -- ${req.session.passport.user}`,
        validOrigins: origins.map(origin => origin.id)
      }).save()
    ]);
    const newProject = await Project.findOne({ _id: projectId });
    res.json({
      data: {
        project: newProject
      }
    });
  } catch (err) {
    UnexpectedRoutingError(err, req, res);
  }
});

projectsRouter.delete("/:projectId", isOwner, async (req, res) => {
  try {
    const userCreatedModels = await UserCreatedModel.find({
      project: req.params.projectId
    });
    for (const userCreatedModel of userCreatedModels) {
      const { name, fields, options } = userCreatedModel;
      const Model = createModel(name, fields, options);
      // await Model.deleteMany({ project: req.params.projectId })
      const modelName = Model.modelName;
      await Model.collection.drop();
      delete mongoose.models[modelName];
      delete mongoose.modelSchemas[modelName];
    }
    await UserCreatedModel.deleteMany({ project: req.params.projectId });
    await Project.findByIdAndRemove({ _id: req.params.projectId });
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $pull: { projects: req.params.projectId }
      }
    );
    res.status(200).json({
      data: {
        message: "Project, related models and documents have been deleted."
      }
    });
  } catch (err) {
    UnexpectedRoutingError(err, req, res);
  }
});

module.exports = projectsRouter;
