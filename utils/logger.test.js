const test = require('ava')
const logger = require('../utils/logger')

test('logger has info method', t => {
  t.true(logger.hasOwnProperty('info'))
  t.true(typeof logger.info === 'function')
})
