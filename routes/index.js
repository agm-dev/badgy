const express = require('express')
const router = express.Router()
const achievementController = require('../controllers/achievementController')
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

module.exports = router
