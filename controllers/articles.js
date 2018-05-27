const { Article, Comment, Topic, User } = require("../models");


const addCommentCount = (article) => {
  console.log(article, "ArTICLE")
  return Promise.all([Comment.count({belongs_to: article._id}), article])
  .then(([commentCount, article]) => {
      article.comments = commentCount
      return article
 })
 .catch((err) => {
   console.log(err.name, 'COMMENT error')
 })
}

exports.getArticles = (req, res, next) => {
 Article.find().lean()
 .then(articles => {
   return Promise.all([articles, ...articles.map(addCommentCount)]) 
 })
 .then(articles => {
   res.send({articles})
 })
 .catch(next)
   }

exports.getArticleById = (req, res, next) => {
  console.log("getting article by id", (/\d[a-z]/).test(req.params.article_id.toString()));
  if(req.params.article_id.length !== 24)/*|| !(/\d[a-z]/).test(req.params.article_id.toString()))*/ next({status: 400, msg: `bad request: ${req.params.article_id} is not a valid id`})
 Article.findOne({ _id: req.params.article_id }).lean()
    .then(article => {
     return addCommentCount(article)
    })
    .then(article => {
      res.send({article})
    })
    .catch((err) => {
      console.log(err.name)
      if(err.name === 'CastError' || err.name === 'TypeError') return next({status: 404, msg: `article ${req.params.article_id} could not be found`})
      next(err)
    })
  }

exports.getCommentsByArticleId = (req, res, next) => {
  console.log(req.params, "getting comments by article id");
  Comment.find({ belongs_to: req.params.article_id })
    .then(comments => {
      return comments.length === 0 ? next({status: 404, msg: `no comments found for article ${req.params.article_id}`}) : res.send({ comments });
    })
    .catch((err) => {
      if(err.name === 'CastError') return next({status: 400, msg: `article ${req.params.article_id} could not be found`})
      else next(err)
    })
};

exports.addCommentToArticle = (req, res, next) => {
  console.log("adding comment to article");
  return User.findOne()
  .then((user) => {
    const newComment = new Comment({
      body: req.body.comment,
      belongs_to: req.params.article_id,
      created_by: user._id
    });
    return Comment.create(newComment)
  })
    .then(comment => {
     res.status(201).send({comment})
    })
    .catch((err) => {
       next({status: 400, msg: `article ${req.params.article_id} cannot be found. Your comment has not been added`})
      })
    }


  exports.changeVotesArticle = (req, res, next) => {
    let count;
    req.query.vote === "up" ? count = 1 : req.query.vote === "down" ? count = -1 : next({status: 400, msg: 'Please enter up or down'})
      Article.findByIdAndUpdate(req.params.article_id, { $inc: { votes: count } }, {new: true})
        .then(article => {
          !article ? next({status: 404, msg: `article ${req.params.article_id} cannot be found. Your vote has not been added` }) : res.status(202).send({ article });
        })
        .catch((err) => {
          if(err.name === 'CastError') return next({status: 400, msg:`article ${req.params.article_id} cannot be found. Your vote has not been added`})
          else next(err)
        })
      }
