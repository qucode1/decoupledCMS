const express = require("express");
const documentsRouter = express.Router({ mergeParams: true });
const mongoose = require("mongoose");

const { createModel } = require("../utils/dynamicSchema");
const { UserCreatedModel } = require("../models/UserCreatedModel");

const { UnexpectedRoutingError } = require("../utils/errorHandling");

documentsRouter.get("/", async (req, res) => {
  try {
    const { name, fields, options } = await UserCreatedModel.findOne({
      _id: req.params.modelId
    });
    const model = createModel(name, fields, options);
    const { documents } = await UserCreatedModel.findOne(
      { _id: req.params.modelId },
      { documents: 1 }
    ).populate({ path: "documents", model });
    res.json({
      data: {
        documents
      }
    });
  } catch (err) {
    UnexpectedRoutingError(err, req, res);
  }
});

documentsRouter.get("/:documentId", async (req, res) => {
  try {
    const { _id, name, fields, options } = await UserCreatedModel.findOne({
      _id: req.params.modelId
    });
    const model = createModel(name, fields, options);
    const document = await model.findOne({ _id: req.params.documentId });
    res.json({
      data: {
        document
      }
    });
  } catch (err) {
    UnexpectedRoutingError(err, req, res);
  }
});

documentsRouter.post("/", async (req, res) => {
  try {
    const documentId = new mongoose.Types.ObjectId();
    const modelData = await UserCreatedModel.findOne({
      _id: req.params.modelId
    });
    const { name, fields, options } = modelData;

    const DocumentModel = createModel(name, fields, options);

    modelData.documents.push(documentId);
    await Promise.all([
      modelData.save(),
      new DocumentModel({
        ...req.body,
        owner: req.session.passport.user,
        project: req.params.projectId,
        model: req.params.modelId,
        _id: documentId
      }).save()
    ]);
    const newDocument = await DocumentModel.findOne({
      _id: documentId
    });

    res.json({
      data: {
        document: newDocument
      }
    });
  } catch (err) {
    UnexpectedRoutingError(err, req, res);
  }
});

documentsRouter.put("/:documentId", async (req, res) => {
  try {
    const modelData = await UserCreatedModel.findOne({
      _id: req.params.modelId
    });
    const { name, fields, options } = modelData;
    const DocumentModel = createModel(name, fields, options);

    const document = await DocumentModel.findById(req.params.documentId);
    const parsedFields = await JSON.parse(fields);

    parsedFields.forEach(([key]) => {
      if (!["owner", "project", "model"].includes(key)) {
        document[key] = req.body[key];
      }
    });

    await document.save();
    const updatedDocument = await DocumentModel.findOne({
      _id: req.params.documentId
    });

    res.json({
      data: {
        document: updatedDocument
      }
    });
  } catch (err) {
    UnexpectedRoutingError(err, req, res);
  }
});

documentsRouter.delete("/:documentId", async (req, res) => {
  try {
    const modelData = await UserCreatedModel.findOne({
      _id: req.params.modelId
    });
    const { name, fields, options, documents } = modelData;
    const DocumentModel = createModel(name, fields, options);

    modelData.documents = documents.filter(id => {
      return id.toString() !== req.params.documentId;
    });

    await DocumentModel.findByIdAndRemove(req.params.documentId);
    await modelData.save();

    res.json({
      data: {
        message: "Document has been removed."
      }
    });
  } catch (err) {
    UnexpectedRoutingError(err, req, res);
  }
});

module.exports = documentsRouter;
