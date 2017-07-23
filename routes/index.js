const express = require('express')
const router = express.Router()
const achievementController = require('../controllers/achievementController')
//const userController = require('../controllers/userController')
const { catchErrors } = require('../handlers/errorHandlers')

// Route handling time!

// Achievements stuff:
router.get('/', achievementController.homePage)
router.get('/achievements', catchErrors(achievementController.getAchievements))
router.get('/achievements/add', achievementController.addAchievement)
router.post('/achievements/add',
  achievementController.upload,
  catchErrors(achievementController.resize),
  catchErrors(achievementController.createAchievement)
)
router.get('/achievements/:slug', catchErrors(achievementController.getAchievementBySlug))
router.post('/achievements/:id',
  achievementController.upload,
  catchErrors(achievementController.resize),
  catchErrors(achievementController.updateAchievement)
)

// Users stuff:
/*
router.get('/account')
router.post('/account')
router.post('/account/forgot')
router.get('/account/reset/:token')
router.post('/account/reset/:token')
router.get('/register')
router.post('/register')
router.get('/login')
router.post('/login')
router.get('/logout')
*/

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
