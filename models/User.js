const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'You must supply an email address',
    index: true
  },
  name: {
    type: String,
    required: 'You must supply a name',
    trim: true,
    lowercase: true,
    unique: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  organizations: [
    { type: mongoose.Schema.ObjectId, ref: 'Organization' }
  ],
  groups: [
    { type: mongoose.Schema.ObjectId, ref: 'Group' }
  ],
  achievements: [
    { type: mongoose.Schema.ObjectId, ref: 'Achievement' }
  ]
});

/* Gravatar exposes profile pictures by hashing with md5 the email addresses */
userSchema.virtual('gravatar').get(function() {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler);

function autopopulate(next) {
  this.populate('organizations')
  this.populate('achievements')
  next()
}

userSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('User', userSchema);
