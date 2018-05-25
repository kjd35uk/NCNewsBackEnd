process.env.NODE_ENV = process.env.NODE_ENV || "dev"
const seedDB = require('./seed');
const mongoose = require('mongoose');
const {DB_URL} = require('../config');
const {topicData, userData, commentData, articleData} = require('../seed/devData')

mongoose.connect(DB_URL)
.then(() => {
  console.log(DB_URL, 'URL')
  return seedDB(topicData, userData, articleData, commentData)
})
.then (() => {
  console.log('DB successfully seeded')
  return mongoose.disconnect()
})
.then(() => {
  console.log('DB disconnected')
})
.catch((err) => {
console.log(err)
return mongoose.disconnect()
});

