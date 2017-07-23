const express = require('express')
const router = express.Router()
const achievementController = require('../controllers/achievementController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const organizationController = require('../controllers/organizationController')
const { catchErrors } = require('../handlers/errorHandlers')

// Route handling time!

// Achievements stuff:
router.get('/', achievementController.homePage)
router.get('/achievements', catchErrors(achievementController.getAchievements))
router.get('/achievements/add', authController.isLoggedIn, achievementController.addAchievement)
router.post('/achievements/add',
  authController.isLoggedIn,
  achievementController.upload,
  catchErrors(achievementController.resize),
  catchErrors(achievementController.createAchievement)
)
router.get('/achievements/:slug', catchErrors(achievementController.getAchievementBySlug))
router.post('/achievements/:id',
  authController.isLoggedIn,
  achievementController.upload,
  catchErrors(achievementController.resize),
  catchErrors(achievementController.updateAchievement)
)

// Users stuff:
router.get('/account', authController.isLoggedIn, userController.account)
router.post('/account', authController.isLoggedIn, catchErrors(userController.updateAccount))
router.post('/account/forgot', catchErrors(authController.forgot))
router.get('/account/reset/:token', catchErrors(authController.reset))
router.post('/account/reset/:token',
  authController.confirmedPasswords,
  catchErrors(authController.update)
)
router.get('/register', userController.registerForm)
router.post('/register',
  userController.validateRegister,
  catchErrors(userController.register),
  authController.login
)
router.get('/login', userController.loginForm)
router.post('/login', authController.login)
router.get('/logout', authController.logout)

// Organizations stuff:
router.get('/organizations', catchErrors(organizationController.getOrganizations))
router.get('/organizations/add', authController.isLoggedIn, organizationController.addOrganization)
router.post('/organizations/add',
  authController.isLoggedIn,
  organizationController.upload, // TODO: refactor this functions and move them to helpers or handlers
  catchErrors(organizationController.resize),
  catchErrors(organizationController.createOrganization)
)
router.get('/organizations/:slug', catchErrors(organizationController.getOrganizationBySlug))
router.post('/organizations/:id')

// Groups stuff:
/*
manage groups creation inside organization page?
*/


module.exports = router
