const mongoose = require('mongoose')
const Achievement = mongoose.model('Achievement') // We don't need to import the Achievement model again because we did it on start file, and mongoose just need to 'load' the models once:

exports.homePage = (req, res) => {
  res.render('index', { title: 'Home' })
}

exports.getAchievements = async (req, res) => {
  const achievements = await Achievement.find()
  res.json(achievements)
  return
  res.render('achievements', { title: 'Achievements', achievements })
}
