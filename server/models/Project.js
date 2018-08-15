const mongoose = require("mongoose")
const { Schema } = mongoose

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  models: {
    type: [Schema.Types.ObjectId]
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
})

module.exports.Project = mongoose.model("Project", projectSchema)
