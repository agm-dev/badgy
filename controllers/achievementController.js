const mongoose = require('mongoose')
const Achievement = mongoose.model('Achievement') // We don't need to import the Achievement model again because we did it on start file, and mongoose just need to 'load' the models once.
const Organization = mongoose.model('Organization')
const multer = require('multer') // npm package to manage uploads.
const jimp = require('jimp') // npm package to modify images.
const uuid = require('uuid') // npm package to get unique ids (for image names).

const multerOptions = {
  storage: multer.memoryStorage(), // store the files on memory because we are gonna edit them before saving
  fileFilter (req, file, next) {
    const isImage = file.mimetype.startsWith('image/')
    if (isImage) {
      next(null, true)
    } else {
      next({ message: 'That filetype is not allowed.'}, false)
    }
  } // this filters what type of files are accepted
}

exports.homePage = (req, res) => {
  res.render('index', { title: 'Home' })
}

exports.getAchievements = async (req, res) => {
  const achievements = await Achievement.find()
  res.render('achievements', { title: 'Achievements', achievements })
}

exports.getAchievementBySlug = async (req, res, next) => {
  const achievement = await Achievement.findOne({ slug: req.params.slug })
  if (!achievement) return next()
  res.render('editAchievement', { title: 'Edit Achievement', achievement })
}

exports.addAchievement = (req, res) => {
  res.render('editAchievement', { title: 'Add Achievement' })
}

exports.upload = multer(multerOptions).single('image')

exports.resize = async (req, res, next) => {
  if (!req.file) { // checks if there is file to resize
    next()
    return
  }
  const extension = req.file.mimetype.split('/')[1]
  req.body.image = `${uuid.v4()}.${extension}`
  const photo = await jimp.read(req.file.buffer)
  await photo.resize(250, 250) // use jimp.AUTO in one of the values if want to scale properly
  await photo.write(`./public/uploads/${req.body.image}`)
  next()
}

exports.createAchievement = async (req, res) => {
  const achievement = await (new Achievement(req.body)).save()
  if (req.body.organizations && req.body.organizations.length) {
    // Add the achievement to the organization:
    const organization = await Organization.findOne({ _id: req.body.organizations[0] })
    if (!organization.achievements.some(a => a._id.equals(achievement._id))) {
      organization.achievements.push(achievement._id)
      await organization.save()
    }
  }
  req.flash('success', `Successfully created ${achievement.name}.`)
  res.redirect(`/achievements/${achievement.slug}`)
}

exports.updateAchievement = async (req, res) => {
  const achievement = await Achievement.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new object instead of the old one
    runValidators: true
  }).exec()
  req.flash('success', `Successfully updated <strong>${achievement.name}</strong>. <a href="/achievements/${achievement.slug}">View Achievement</a>`)
  res.redirect(`/achievements/${achievement.slug}`)
}
