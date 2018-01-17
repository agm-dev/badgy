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
