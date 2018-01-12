// requires:
const winston = require('winston')
const fs = require('fs')
require('dotenv').config()

// variables:
const logDir = process.env.LOG_DIR || 'logs'
const logLevel = process.env.LOG_LEVEL || 'error'
const logName = process.env.APP_NAME ? process.env.APP_NAME.toLowerCase() : 'app'
const tsFormat = () => (new Date()).toLocaleTimeString()

// create the log directory if it does not exist
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)

// logger instance, config and export
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: logLevel
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/-${logName}.log`,
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true,
      level: logLevel
    })
  ]
})

module.exports = logger
