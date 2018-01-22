/**
 * Set up database ready to prod
 * or populate it with test data
 */

const connection = require('./database')
const logger = require('./logger')
require('dotenv').config()

async function populateDatabase () {
  const prod = process.env.NODE_ENV && process.env.NODE_ENV === 'prod'
  if (prod) {
    await populateProd()
  } else {
    await populateDev()
  }
}

async function removeTables () {
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
}

async function createUserTable () {
  logger.info(`[ fn:createUserTable() ] generating user table`)
  await connection.execute(
    `CREATE TABLE IF NOT EXISTS user
    (
      id                           INT auto_increment PRIMARY KEY,
      public_id                    CHAR(40) NOT NULL UNIQUE,
      name                         VARCHAR(30) NOT NULL UNIQUE,
      email                        VARCHAR(50) NOT NULL UNIQUE,
      hash                         CHAR(128) NOT NULL,
      team                         INT DEFAULT NULL,
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
}

async function createTeamTable () {
  logger.info(`[ fn:createTeamTable() ] generating team table`)
  await connection.execute(
    `CREATE TABLE IF NOT EXISTS team
    (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      public_id    CHAR(40) NOT NULL UNIQUE,
      name         VARCHAR(30) NOT NULL UNIQUE,
      description  TEXT,
      image        VARCHAR(200),
      admin        INT,
      create_date  DATETIME DEFAULT Now(),
      update_date  DATETIME
    )
    engine=innodb`
  )
}

async function createBadgeTable () {
  logger.info(`[ fn:createBadgeTable() ] generating badge table`)
  await connection.execute(
    `CREATE TABLE IF NOT EXISTS badge
    (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      public_id     CHAR(40) NOT NULL UNIQUE,
      name          VARCHAR(30) NOT NULL UNIQUE,
      description   TEXT,
      value         INT(4) DEFAULT 0,
      image         VARCHAR(200),
      validated     TINYINT(1) DEFAULT 0,
      create_date   DATETIME DEFAULT Now(),
      update_date   DATETIME
    )
    engine=innodb`
  )
}

async function createTagTable () {
  logger.info(`[ fn:createTagTable() ] generating tag table`)
  await connection.execute(
    `CREATE TABLE IF NOT EXISTS tag
    (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      name          VARCHAR(30) NOT NULL UNIQUE,
      create_date   DATETIME DEFAULT Now()
    )
    engine=innodb`
  )
}

async function createRelUserBadgeTable () {
  logger.info(`[ fn:createRelUserBadgeTable() ] generating rel_user_badge table`)
  await connection.execute(
    `CREATE TABLE IF NOT EXISTS rel_user_badge
    (
      id            INT AUTO_INCREMENT PRIMARY KEY,
      user_id       INT,
      badge_id      INT,
      granted_by    INT,
      message       TEXT,
      create_date   DATETIME DEFAULT Now()
    )
    engine=innodb`
  )
  /*
  rel_tag_team')
  rel_tag_badge')
  rel_tag_user')
  */
}

async function addConstraints () {
  logger.info(`[ fn:addConstraints() ] adding constraints to tables`)
  await connection.execute(
    `ALTER TABLE user
      ADD CONSTRAINT fk_team_id FOREIGN KEY (team)
      REFERENCES team(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE`
  )
  await connection.execute(
    `ALTER TABLE team
      ADD CONSTRAINT fk_admin_id FOREIGN KEY (admin)
      REFERENCES user(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE`
  )
  await connection.execute(
    `ALTER TABLE rel_user_badge
      ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id)
      REFERENCES user(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      ADD CONSTRAINT fk_badge_id FOREIGN KEY (badge_id)
      REFERENCES badge(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
      ADD CONSTRAINT fk_granted_by FOREIGN KEY (granted_by)
      REFERENCES user(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE`
  )
}

async function removeConstraints () {
  logger.info(`[ fn:removeConstraints() ] removing table's constraints`)
  let rows;
  [rows] = await connection.execute('SHOW TABLES LIKE "user"')
  if (rows.length) await connection.execute(`ALTER TABLE user DROP FOREIGN KEY fk_team_id`);
  [rows] = await connection.execute('SHOW TABLES LIKE "team"')
  if (rows.length) await connection.execute(`ALTER TABLE team DROP FOREIGN KEY fk_admin_id`);
  [rows] = await connection.execute('SHOW TABLES LIKE "rel_user_badge"')
  if (rows.length) await connection.execute(`ALTER TABLE rel_user_badge DROP FOREIGN KEY fk_user_id, DROP FOREIGN KEY fk_badge_id, DROP FOREIGN KEY fk_granted_by`)
}

async function populateDev () {
  await removeConstraints()
  await removeTables()

  // Add all tables:
  await createUserTable()
  await createTeamTable()
  await createBadgeTable()
  await createTagTable()
  await createRelUserBadgeTable()

  // Add constraints:
  await addConstraints()

  // Add fake data:

  await connection.end()
}

async function populateProd () {
    // TODO: create tables if not exists, and relations, and initial admin user
}

module.exports = populateDatabase
