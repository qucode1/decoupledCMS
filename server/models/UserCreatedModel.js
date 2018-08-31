const mongoose = require("mongoose")
const { Schema } = mongoose

const UserCreatedModelSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  fields: {
    type: String,
    required: true
  },
  entry: {
    type: String,
    required: true
  },
  options: String,
  documents: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  project: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Project"
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
})

module.exports.UserCreatedModel = mongoose.model(
  "UserCreatedModel",
  UserCreatedModelSchema
)
