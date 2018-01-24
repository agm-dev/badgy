const mail = require('../../utils/mail')
const bcrypt = require('bcryptjs')
const User = require('./User')

const getEmailData = (to, text) => ({ from: process.env.SMTP_USER, to, subject: 'Activate Account', text })

exports.createUser = async (req, res) => {
  const requestToken = req.body.request_token || false
  if (!requestToken) return res.status(400).json({ status: 'KO', message: 'Missing required param: request_token' })
  const password = req.body.password || false
  if (!password) return res.status(400).json({ status: 'KO', message: 'Missing required param: password' })
  const name = req.body.name || false
  if (!name) return res.status(400).json({ status: 'KO', message: 'Missing required param: name' })
  const email = req.body.email || false
  if (!email) return res.status(400).json({ status: 'KO', message: 'Missing required param: email' })
  const hash = await bcrypt.hash(password.trim(), Number(process.env.BCRYPT_SALT_ROUNDS))
  const userData = {
    name,
    email,
    hash,
    requestToken
  }
  // TODO: validation of input data and proper error response
  const user = new User(userData)
  // If same name, email, and request_token, and user is in DB, response with a success:
  const isSameRequest = await user.isSameRequest()
  if (isSameRequest) return res.status(201).json({ status: 'OK', message: 'A new user has been created', data: { name: user.name, email: user.email, id: user.public_id } })

  // Check if email or name exists:
  const alreadyExists = await user.alreadyExists()
  if (alreadyExists) return res.status(502).json({ status: 'KO', message: 'The name or email specified are already in use :/' })
  const userSaved = await user.save()
  if (!userSaved) return res.status(500).json({ status: 'KO', message: 'There was some error on creating your new user :(' })
  const userResponseData = { name: user.name, email: user.email, id: user.public_id }
  res.status(201).json({ status: 'OK', message: 'A new user has been created', data: userResponseData })
  // Send activation email:
  const emailData = getEmailData(user.email, `Go to ${process.env.DOMAIN}/${process.env.API_VERSION}/user/activate/${user.activation_token} to activate your account :)`)
  mail.sendMail(emailData, (err, info) => {
    if (err) return console.error(err)
    return console.log(`Activation email sent: ${info.response}`)
  })
}
