
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const { DB_URL } = require("../config");
const { Article, Comment, Topic, User } = require("../models");
const { formatArticleData, formatCommentData } = require("../utils");


const seedDB = (topicData, userData, articleData, commentData) => {
  return mongoose.connection
      .dropDatabase()
      .then(() => {
        return Promise.all([Topic.insertMany(topicData),User.insertMany(userData)]);
      })
      .then(([topicDocs, userDocs]) => {
        return Promise.all([Article.insertMany(formatArticleData(articleData, userDocs, topicDocs)), userDocs, topicDocs])
      })
      .then(([articleDocs, userDocs, topicDocs]) => {
        return Promise.all([Comment.insertMany(formatCommentData(commentData, articleDocs, userDocs)), topicDocs, articleDocs, userDocs])
      })
     
};

module.exports = seedDB;
