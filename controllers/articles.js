const { Article, Comment, Topic, User } = require("../models");

// 

exports.getArticles = (req, res, next) => {
  Article.find()
    .then(articles => {
      res.send({ articles });
    })
    .catch(next);
};


exports.getArticleById = (req, res, next) => {
  console.log(req.params, "getting article by id");
  Article.findOne({ _id: req.params.article_id })
    .then(article => {
      article === null ?  next({status: 404, msg: `article ${req.params.article_id} not found`}) : res.send({ article })
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  console.log(req.params, "getting comments by article id");
  Comment.find({ belongs_to: req.params.article_id })
    .then(comments => {
      console.log(comments, 'LENGTH')
      return comments.length === 0 ? next({status: 404, msg: `no comments found for article ${req.params.article_id}`}) : res.send({ comments });
    })
    .catch((err) => {
      if(err.name === 'CastError') return next({status: 400})
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
      console.log(comment)
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
