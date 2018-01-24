// const logger = require('../../utils/logger')
const logger = require('../../utils/logger')
const connection = require('../../utils/database')
const crypto = require('crypto')
const uuidv1 = require('uuid/v1')

class User {
  constructor (data) {
    this.name = this.normalizeName(data.name)
    this.email = this.normalizeEmail(data.email)
    this.hash = data.hash
    this.public_id = uuidv1()
    this.activation_token = this.generateRandomValueHex(100)
    this.request_token = data.requestToken
  }

  async save () {
    try {
      let [rows] = await connection.execute('INSERT INTO user (public_id, name, email, hash, activation_token, request_token) VALUES (?,?,?,?,?,?)', [this.public_id, this.name, this.email, this.hash, this.activation_token, this.request_token])
      logger.info(`[ User::save ] saved user rows: ${JSON.stringify(rows)}`)
      return true
    } catch (e) {
      logger.error(`[ User::save ] error on saving new user`)
      return false
    }
  }

  async alreadyExists () {
    let [rows] = await connection.execute('SELECT public_id FROM user WHERE name = ? OR email LIKE ?', [this.name, this.email])
    if (rows && rows.length) {
      logger.warn(`[ User::alreadyExists ] User with name: ${this.name} and email: ${this.email} already exists`)
      return true
    }
    return false
  }

  async isSameRequest () {
    let [rows] = await connection.execute('SELECT name, email, public_id FROM user WHERE name = ? AND email = ? AND request_token = ?', [this.name, this.email, this.request_token])
    if (rows && rows.length) {
      logger.info(`[ User::isSameRequest ] user data: ${JSON.stringify(rows)}`)
      this.name = rows[0].name
      this.email = rows[0].email
      this.public_id = rows[0].public_id
      return true
    }
    return false
  }

  generateRandomValueHex (length) {
    return crypto.randomBytes(Math.ceil(length / 2)) // each byte generates two characters
      .toString('hex') // converted to hex format
      .slice(0, length)
  }

  normalizeName (name) {
    if (typeof name !== 'string' || !name.length) return null
    return name.trim().toLowerCase()
  }

  normalizeEmail (email) {
    if (typeof email !== 'string' || !email.length) return null
    return email.trim().toLowerCase()
  }

  static isValidEmail (email) {

  }

  static isValidName (name) {

  }

  static isValidPassword (password) {

  }

  static isValidRequestToken (requestToken) {

  }

  generateResetPasswordToken () {
      // TODO:
  }
}

module.exports = User
