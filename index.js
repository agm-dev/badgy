// requires
const logger = require('./utils/logger')
const express = require('express')
const bodyParser = require('body-parser')
const errorHandlers = require('./utils/errorHandlers')
const catchErrors = errorHandlers.catchErrors
const userController = require('./resources/users/userController')
require('dotenv').config()

// Router set up:
const router = express.Router()
// TODO: this route must server the static react app compiled:
router.get('/', (req, res) => {
  res.send(process.env.APP_NAME || 'badgy')
})
const apiVersion = process.env.API_VERSION || 'v1'
const apiPath = `/api/${apiVersion}`

// User routes:
router.post(`${apiPath}/user`, catchErrors(userController.createUser))

// Express app set up:
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', router)
app.use(errorHandlers.notFound)

if (process.env.NODE_ENV === 'development') {
  app.use(errorHandlers.developmentErrors)
}

app.use(errorHandlers.productionErrors)

// Start the app:
app.set('port', process.env.PORT || 8000)
const server = app.listen(app.get('port'), () => {
  logger.info(`[ index.js ] App running on port ${server.address().port}`)
})
