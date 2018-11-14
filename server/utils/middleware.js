const {
  AuthenticationError,
  AuthorizationError,
  UnexpectedError
} = require("./errorHandling");

const { Project } = require("../models/Project");
const { Origin } = require("../models/Origin");

const isOwner = async (req, res, next) => {
  try {
    if (req.session.passport && req.session.passport.user) {
      if (req.session.passport.user === req.params.user) next();
      else AuthorizationError(res);
    } else {
      const receivedKey = req.headers["api-key"];
      if (receivedKey && req.params.projectId) {
        const project = await Project.findById(req.params.projectId).populate({
          path: "validOrigins",
          model: Origin
        });
        const match = !!project.validOrigins.find(
          origin => origin.apiKey === receivedKey
        );
        // console.log("match", match);
        match ? next() : AuthorizationError(res);
      } else AuthenticationError(res);
    }
  } catch (err) {
    UnexpectedError(err, req, res);
  }
};

module.exports = {
  isOwner
};
