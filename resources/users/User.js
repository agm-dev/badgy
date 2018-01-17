// const logger = require('../../utils/logger')
const connection = require('../../utils/database')

class User {
  constructor (data) {
    this.name = this.normalizeName(data.name)
    this.email = this.normalizeEmail(data.email)
    this.hash = data.hash
    this.activation_token = data.activation_token
  }

  async save () {
    let [rows, fields] = await connection.execute('SELECT id, field1, field2 FROM test WHERE id > ?', [2])
    console.log(rows)
    console.log(fields)
    connection.end()
  }

  normalizeName (name) {
    if (typeof name !== 'string' || !name.length) return null
    return name.trim().toLowerCase()
  }

  normalizeEmail (email) {

  }

  generateResetPasswordToken () {
      // TODO:
  }
}

module.exports = User
