const mongoose = require('mongoose')
mongoose.Promise = global.Promise // This links mongoose Promise with the node built in Promise.
const slug = require('slugs') // Allow to make url friendly names for us

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    lowercase: true,
    required: 'Please enter an organization name!',
    unique: true
  },
  description: {
    type: String,
    trim: true,
    lowercase: true,
    required: 'Please enter a description for the organization'
  },
  image: {
    type: String,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true
  }, // This will be automatically generated.
  achievements: [
    { type: mongoose.Schema.ObjectId, ref: 'Achievement' }
  ],
  users: [
    { type: mongoose.Schema.ObjectId, ref: 'User' }
  ]
})

// Define indexes:
organizationSchema.index({
  name: 'text',
  description: 'text',
  slug: 'text'
})

organizationSchema.pre('save', async function (next) {
  if (!this.isModified('name')) { // must be mongoose feature function ?
    next() // skipt this middleware.
    return // stop this function from running
  }
  this.slug = slug(this.name)
  // have to find other slugs:
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
  const organizationsWithSlug = await this.constructor.find({ slug: slugRegEx })
  if (organizationsWithSlug.length) {
    this.slug = `${this.slug}-${organizationsWithSlug.length + 1}` // this should grant unique slug
  }
  next()
})

function autopopulate(next) {
  this.populate('achievements')
  this.populate('users')
  next()
}

organizationSchema.pre('find', autopopulate);
organizationSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Organization', organizationSchema)
