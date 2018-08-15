const mongoose = require("mongoose")
const { Schema } = mongoose

const types = {
  String: String,
  Boolean: Boolean,
  Date: Date,
  Number: Number,
  ObjectId: Schema.Types.ObjectId
}

const createSchema = (fieldDataString, schemaOptions) => {
  const fieldDataArray = JSON.parse(fieldDataString)
  const parsedSchemaOptions = schemaOptions ? JSON.parse(schemaOptions) : {}
  const fieldDataObj = fieldDataArray.reduce(
    (schemaObj, [fieldName, fieldType, { required, unique, index } = {}]) => {
      schemaObj[fieldName] = {
        type: Array.isArray(fieldType)
          ? [types[fieldType[0]]]
          : types[fieldType],
        required,
        unique,
        index
      }
      return schemaObj
    },
    {}
  )
  return new Schema(fieldDataObj, parsedSchemaOptions)
}
const createModel = (modelName, fieldDataString, schemaOptions, _id) => {
  try {
    return mongoose.modelNames().includes(modelName)
      ? mongoose.model(modelName)
      : mongoose.model(modelName, createSchema(fieldDataString, schemaOptions))
  } catch (err) {
    console.log(`[ERROR] [${new Date()}] createModel\n\n`, err)
  }
}

module.exports = {
  createModel
}
