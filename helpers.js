/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// Moment.js is a handy library for displaying dates:
exports.moment = require('moment')

// Dump is a handy debugging function we can use to sort of "console.log" our data:
exports.dump = (obj) => JSON.stringify(obj, null, 2)

// inserting an SVG
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`)

// Some details about the site
exports.siteName = `Badgy`

exports.menu = [
  { slug: '/achievements', title: 'Achievements', icon: 'achievement' },
  { slug: '/settings', title: 'settings', icon: 'setting' }
]
