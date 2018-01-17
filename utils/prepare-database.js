/**
 * Set up database ready to prod
 * or populate it with test data
 */

const connection = require('./database')
const logger = require('./logger')
require('dotenv').config()

async function populateDatabase () {
  const prod = process.env.NODE_ENV && process.env.NODE_ENV === true
  if (prod) {
    populateProd()
  } else {
    await populateDev()
  }
}

async function populateDev () {
    // Remove all tables:
  logger.info(`[ fn:populateDev() ] removing all tables`)
  await connection.execute('DROP TABLE IF EXISTS rel_tag_team')
  await connection.execute('DROP TABLE IF EXISTS rel_tag_badge')
  await connection.execute('DROP TABLE IF EXISTS rel_tag_user')
  await connection.execute('DROP TABLE IF EXISTS rel_user_badge')
  await connection.execute('DROP TABLE IF EXISTS tag')
  await connection.execute('DROP TABLE IF EXISTS team')
  await connection.execute('DROP TABLE IF EXISTS badge')
  await connection.execute('DROP TABLE IF EXISTS user')

    // Add all tables:
  logger.info(`[ fn:populateDev() ] generating user table`)
  await connection.execute(
        `CREATE TABLE IF NOT EXISTS user
        (
            id                           INT auto_increment PRIMARY KEY,
            public_id                    CHAR(40) NOT NULL UNIQUE,
            name                         VARCHAR(30) NOT NULL UNIQUE,
            email                        VARCHAR(50) NOT NULL UNIQUE,
            hash                         CHAR(128) NOT NULL,
            activated                    TINYINT(1) DEFAULT 0,
            activation_token             CHAR(100),
            reset_password_token         CHAR(100),
            reset_password_token_expires DATETIME,
            login_fails                  INT(2) DEFAULT 0,
            activation_date              DATETIME,
            last_login_date              DATETIME,
            create_date                  DATETIME DEFAULT Now(),
            update_date                  DATETIME
        )
        engine=innodb`
    )

    // Add fake data:

  await connection.end()
}

function populateProd () {
    // TODO: create tables if not exists, and relations, and initial admin user
}

module.exports = populateDatabase
