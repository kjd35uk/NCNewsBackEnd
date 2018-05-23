process.env.NODE_ENV = "dev";
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const { DB_URL } = require("../config");
const { Article, Comment, Topic, User } = require("../models");
const { formatArticleData, createUserRef} = require('../utils')
const {topicData, userData, articleData, commentData} = require('./devData')

const seedDB = (topicData, userData, articleData, commentData) => {
  return mongoose.connection.dropDatabase()
  .then (() => {
    return Promise.all([Topic.insertMany(topicData), User.insertMany((userData))])
  })
  .then(([topicDocs, userDocs]) => {
console.log(topicDocs.length, userDocs.length, 'TOPIC & USERDATA')//works
return Promise.all([Article.insertMany(formatArticleData(articleData, userDocs, userData)), topicDocs])
  })
.then ((articleDocs) => {
  console.log(articleDocs.length, 'ARTICLE DOCS')

})
}

module.exports = seedDB;