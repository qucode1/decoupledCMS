const mongoose = require("mongoose");
const { Schema } = mongoose;

const originSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  apiKey: {
    type: String,
    required: true,
    unique: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
});

module.exports.Origin = mongoose.model("Origin", originSchema);
