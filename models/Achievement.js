const mongoose = require('mongoose')
mongoose.Promise = global.Promise // This links mongoose Promise with the node built in Promise.
const slug = require('slugs') // Allow to make url friendly names for us

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true, // this will trim the name string before reaching the model
    lowercase: true,
    required: 'Please enter a achievement name!', // TIP: you can pass just true boolean type and it will be required but a string performs as true boolean and indicates the custom error message.
    unique: true
  },
  description: {
    type: String,
    trim: true,
    lowercase: true,
    required: 'Please enter a description for the achievement'
  },
  organization: {
    type: mongoose.Schema.ObjectId,
    ref: 'Organization'
  },
  points: {
    type: Number
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
  tags: [String] // This means it expects an array of strings values
})

// Define indexes:
achievementSchema.index({
  name: 'text',
  description: 'text',
  slug: 'text'
})

// This is a kind of middleware that will run every time an Achievement is saved: on insert and update
achievementSchema.pre('save', async function (next) { // TIP: you cannot use an arrow function here because you need to access this object.
  if (!this.isModified('name')) { // must be mongoose feature function ?
    next() // skipt this middleware.
    return // stop this function from running
  }
  this.slug = slug(this.name)
  // have to find other slugs:
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
  const achievementsWithSlug = await this.constructor.find({ slug: slugRegEx })
  if (achievementsWithSlug.length) {
    this.slug = `${this.slug}-${achievementsWithSlug.length + 1}` // this should grant unique slug
  }
  next()
})

achievementSchema.statics.getTagsList = function () {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])
}

module.exports = mongoose.model('Achievement', achievementSchema)
