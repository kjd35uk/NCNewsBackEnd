const { Topic, Article, User } = require("../models");
const {addCommentCount} = require('../utils')

exports.getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      if(topics !== null) res.send({ topics });
    })
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  if(!isNaN(+req.params.topic)) next({status: 400, msg: `bad request: ${req.params.topic} is not a string`})
  Article.find({ belongs_to: req.params.topic }).populate('created_by').lean()
    .then(articles => {
     return Promise.all([...articles.map(addCommentCount)]) 
    })
    .then(articles => {
      articles.length === 0 ? next({status: 404, msg: `${req.params.topic} not found`}) : res.send({articles})
    })
   .catch(next)
};

// exports.addArticlesToTopic = (req, res, next) => {
//   console.log("adding article");
//   if(!isNaN(+req.params.topic)) next({status: 400, msg: `bad request: ${req.params.topic} is not a string`})
//   Topic.findOne({slug: req.params.topic})
//   .then(topic => {
//     if(topic === null) next({status:404, msg: `${req.params.topic} cannot be found`}) 
//     else return User.findOne()
//   })
//   .then(user => {
//     const newArticle = new Article({
//       title: req.body.title,
//       body: req.body.body,
//       belongs_to: req.params.topic,
//       created_by: user._id
//     });
//     return Article.create(newArticle).lean()
//   })
//   .then(article => {
//     console.log(article, 'JEJEJEJ')
//     return addCommentCount(article)
//    })
//     .then(article => {
//       res.status(201).send({ article });
//     })
//     .catch(next);
// };

exports.addArticlesToTopic = (req, res, next) => {
  //console.log("adding article");
  if(!isNaN(+req.params.topic)) next({status: 400, msg: `bad request: ${req.params.topic} is not a string`})
  Topic.findOne({slug: req.params.topic})
  .then(topic => {
    if(topic === null) next({status: 404, msg: `topic ${req.params.topic} cannot be found`}) 
    else return User.findOne()
  })
  .then((user) => {
    const newArticle = new Article({
      title: req.body.title,
      body: req.body.body,
      belongs_to: req.params.topic,
      created_by: user._id,
      comments: 0
    });
    return Article.create(newArticle)
  }) 
    .then(article => {
     res.status(201).send({article})
    })
    .catch((err) => {
      if(err.name === 'CastError') return next({status: 404, msg: `topic ${req.params.topic} cannot be found`})
      next(err)
    })
    }