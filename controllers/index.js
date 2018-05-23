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

    exports.addArticlesToTopic = (req, res, next) => {
      console.log('adding articles to comment')
      const newArticle = new Article ({
        title: req.body.title, 
        body: req.body.body, 
        belongs_to: req.params.topic, 
        created_by: '5b0584f799b179c3ae3b4227'})
      return Article.create(newArticle)
      .then(article => {
        res.send({article})
      })
      .catch(console.log)
    }

    exports.getUsers = (req, res, next) => {

      User.find()
      .then (users => {
        res.send({users})
      })
     .catch(console.log)
      }

      exports.getUserByUsername = (req, res, next) => {
        console.log(req.params, 'getting user by username')
      User.findOne({ username : req.params.username})
      .then(user => {
        res.send({user})
      })
      .catch(console.log)
      }


      exports.addCommentToArticle = (req, res, next) => {
        console.log('adding comment to article', req.params, req.body.comment)
        const newComment = new Comment ({
          body: req.body.comment,
          belongs_to: req.params.article_id,
          created_at: new Date().getTime(),
          })
        return Comment.create(newComment)
        .then(comment => {
          res.send({comment})
        })
        .catch(console.log)
      }

     