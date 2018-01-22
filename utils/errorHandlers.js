const logger = require('./logger')

/**
 *
 */

// exports.catchErrors = fn => (...params) => fn(...params).catch(console.error)

exports.catchErrors = function (fn) {
  return function (...params) {
    return fn(...params).catch(function (err) {
      logger.error(`[ fn:catchErrors ] ${err.name}: ${err.message}`)
    })
  }
}

exports.notFound = (req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
}

exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || ''
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
  }
  res.status(err.status || 500)
  res.send(JSON.stringify(errorDetails))
}

exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500)
  res.send(JSON.stringify(err.message))
}
