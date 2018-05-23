const {Article, Comment, Topic, User} = require('../models')


exports.getTopics = (req, res, next) => {

  Topic.find()
  .then (topics => {
    res.send({topics})
  })
 .catch(console.log)
  }

  exports.getArticles = (req, res, next) => {

    Article.find()
    .then (articles => {
      res.send({articles})
    })
   .catch(console.log)
    }

     exports.getArticlesByTopic = ( req, res, next) => {
       console.log('getting articles', req.params)
      Article.find({ belongs_to: req.params.topic })
      .then(articles => {
        res.send({ articles });
      })
      .catch(console.log);
    }


    exports.getArticleById = (req, res, next) => {
      console.log(req.params, 'getting article by id')
      Article.findOne({_id: req.params.article_id})
      .then(article => {
        res.send({ article });
      })
      .catch(console.log);
    }

    exports.getCommentsByArticleId = (req, res, next) => {
      console.log(req.params, 'getting comments by article id')
      Comment.find({ belongs_to : req.params.article_id})
      .then(comments => {
        res.send({comments})
      })
      .catch(console.log)
    }