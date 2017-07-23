/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/
const fs = require('fs')

// Moment.js is a handy library for displaying dates:
exports.moment = require('moment')

// Dump is a handy debugging function we can use to sort of "console.log" our data:
exports.dump = (obj) => JSON.stringify(obj, null, 2)

// inserting an SVG
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`)

// Some details about the site
exports.siteName = `Badgy`

exports.menu = [
  { slug: '/achievements', title: 'achievements', icon: 'achievement' },
  { slug: '/achievements/add', title: 'add achievement', icon: 'achievement' },
  { slug: '/organizations', title: 'organizations', icon: 'organizations' },
  { slug: '/organizations/add', title: 'add organization', icon: 'organizations' },
  { slug: '/groups', title: 'groups', icon: 'groups' },
  { slug: '/groups/add', title: 'add group', icon: 'groups' },
  { slug: '/register', title: 'register', icon: 'register' },
  { slug: '/account', title: 'account', icon: 'account' },
  { slug: '/login', title: 'login', icon: 'login' },
  { slug: '/logout', title: 'logout', icon: 'logout' }
]
