const mongoose = require("mongoose");
const { Schema } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  models: {
    type: [Schema.Types.ObjectId],
    ref: "UserCreatedModel"
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  validOrigins: {
    type: [Schema.Types.ObjectId],
    ref: "Origin"
  }
});

module.exports.Project = mongoose.model("Project", projectSchema);
