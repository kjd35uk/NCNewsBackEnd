process.env.NODE_ENV = process.env.NODE_ENV || "dev"
const seedDB = require('./seed');
const mongoose = require('mongoose');
const {DB_URL} = require('../config');
const {topicData, userData, commentData, articleData} = require('../seed/devData')

mongoose.connect(DB_URL)
.then(() => {
  return seedDB(topicData, userData, articleData, commentData)
})
.then (() => {
  console.log(`DB ${DB_URL} successfully seeded`)
  return mongoose.disconnect()
})
.then(() => {
  console.log('DB disconnected')
})
.catch((err) => {
// next(err)
return mongoose.disconnect()
});

