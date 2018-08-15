const AuthorizationError = res => {
  res.json({
    error: "Not Authorized!"
  })
}
const AuthenticationError = res => {
  res.json({
    error: "Not Authenticated! Please log in first."
  })
}
const UnexpectedError = (err, req, res) => {
  console.log(`\n[Error] [${new Date()}]:\n\n`, err)
  res.json({
    error: {
      message: err.message,
      stack: err.stack
    }
  })
}
const UnexpectedRoutingError = (err, req, res) => {
  console.log(
    `\n[Error] [${new Date()}] \n(${req.method}: ${req.originalUrl}):\n\n`,
    err
  )
  res.json({
    error: {
      message: err.message,
      stack: err.stack
    }
  })
}

module.exports = {
  AuthorizationError,
  AuthenticationError,
  UnexpectedError,
  UnexpectedRoutingError
}
