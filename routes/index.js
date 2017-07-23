const express = require('express')
const router = express.Router()
const achievementController = require('../controllers/achievementController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
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
//router.get('/account')
//router.post('/account')
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
/*
router.get('/organizations')
router.get('/organizations/add')
router.post('/organizations/add')
router.get('/organizations/:slug')
router.post('/organizations/:id')
*/

// Groups stuff:
/*
manage groups creation inside organization page?
*/


module.exports = router
