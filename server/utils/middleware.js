const {
  AuthenticationError,
  AuthorizationError,
  UnexpectedError
} = require("./errorHandling")

const isOwner = (req, res, next) => {
  try {
    if (req.session.passport && req.session.passport.user) {
      if (req.session.passport.user === req.params.user) next()
      else AuthorizationError(res)
    } else {
      AuthenticationError(res)
    }
  } catch (err) {
    UnexpectedError(err, req, res)
  }
}

module.exports = {
  isOwner
}
