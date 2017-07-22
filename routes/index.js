const express = require('express')
const router = express.Router()
const achievements = require('../controllers/achievementController')
const { catchErrors } = require('../handlers/errorHandlers')

// Route handling time!
router.get('/', achievements.homePage)
router.get('/achievements', catchErrors(achievements.getAchievements))

module.exports = router
