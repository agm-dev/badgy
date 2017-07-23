const mongoose = require('mongoose')
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

exports.getOrganizations = async (req, res) => {
  const organizations = await Organization.find()
  res.render('organizations', { title: 'Organizations', organizations })
}

exports.getOrganizationBySlug = async (req, res, next) => {
  const organization = await Organization.findOne({ slug: req.params.slug })
  if (!organization) return next()
  res.render('editOrganization', { title: 'Edit Organization', organization })
}

exports.addOrganization = (req, res) => {
  res.render('editOrganization', { title: 'New Organization' })
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

exports.createOrganization = async (req, res) => {
  const organization = new Organization(req.body)
  organization.administrator = req.user._id
  await organization.save()
  req.flash('success', `Successfully created ${organization.name}.`)
  res.redirect(`/organizations/${organization.slug}`)
}

exports.updateOrganization = async (req, res) => {
  let organization = await Organization.findOne({ _id: req.params.id })
  if (!organization.administrator || !organization.administrator._id.equals(req.user._id)) {
    req.flash('error', `Only administrator can update the organization.`)
    res.redirect(`/organizations`)
  }
  organization = await Organization.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // return the new object instead of the old one
    runValidators: true
  }).exec()
  req.flash('success', `Successfully updated <strong>${organization.name}</strong>. <a href="/organizations/${organization.slug}">View Organization</a>`)
  res.redirect(`/organizations/${organization.slug}`)
}
