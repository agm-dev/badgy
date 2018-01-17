// requires
const logger = require('./utils/logger')
// const User = require('./resources/users/User')
const { catchErrors } = require('./utils/errorHandlers')
const populate = require('./utils/prepare-database')

const main = async () => {
  await populate()
  /*
  const test = new User({ name: 'test', email: 'test@test.com', hash: '12232432', activation_token: 'asdfdsafadsf' })
  await test.save()
  */
  logger.info(`[index.js] ended script`)
  process.exit(1)
}

const mainSafe = catchErrors(main)

mainSafe()

// logger.info(`[index.js] ended script`)
