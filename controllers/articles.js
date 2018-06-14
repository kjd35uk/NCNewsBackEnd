const { Article, Comment, Topic, User } = require("../models");
const {addCommentCount} = require('../utils')


exports.getArticles = (req, res, next) => {
 Article.find().populate('created_by').lean()
 .then(articles => {
   return Promise.all([...articles.map(addCommentCount)])
 })
 .then(articles => {
   res.send({articles})
 })
 .catch(next)
}

exports.getArticleById = (req, res, next) => {
  let id = req.params.article_id
  //console.log("getting article by id");
if(id.length !== 24 || !(/(^[0-9])(?=.*[0-9]).+(?=.*[a-z])/g).test (id.toString()) || id.match(/[^0-9a-z]/i)) next({status: 400, msg: `bad request: ${id} is not a valid article id`})
 Article.findOne({ _id: id }).populate('created_by').lean()
    .then(article => {
     return addCommentCount(article)
    })
    .then(article => {
      res.send({article})
    })
    .catch((err) => {
      if(err.name === 'CastError' || err.name === 'TypeError') return next({status: 404, msg: `article ${id} could not be found`})
      next(err)
    })
  }

exports.getCommentsByArticleId = (req, res, next) => {
  let id = req.params.article_id
  if(id.length !== 24 || !(/(^[0-9])(?=.*[0-9]).+(?=.*[a-z])/g).test (id.toString()) || id.match(/[^0-9a-z]/i)) next({status: 400, msg: `bad request: ${id} is not a valid article id`})
  //console.log(req.params, "getting comments by article id");
  Comment.find({ belongs_to: id }).populate('created_by')
    .then(comments => {
      return comments.length === 0 ? next({status: 404, msg: `article ${id} could not be found`}) : res.send({ comments });
    })
    .catch((err) => {
      if(err.name === 'CastError') return next({status: 404, msg: `article ${id} could not be found`})
      else next(err)
    })
};

exports.addCommentToArticle = (req, res, next) => {
  //console.log("adding comment to article");
  let id = req.params.article_id
  if(id.length !== 24 || !(/(^[0-9])(?=.*[0-9]).+(?=.*[a-z])/g).test (id.toString()) || id.match(/[^0-9a-z]/i)) next({status: 400, msg: `bad request: ${id} is not a valid article id`})
  Article.findOne({_id: id}).populate('created_by')
  .then(article => {
    if(article === null) next({status: 404, msg: `article ${id} cannot be found. Your comment has not been added`}) 
    else return User.findOne()
  })
  .then((user) => {
    const newComment = new Comment({
      body: req.body.comment,
      belongs_to: id,
      created_by: user._id
    });
    return Comment.create(newComment)
  })
    .then(comment => {
     res.status(201).send({comment})
    })
    .catch((err) => {
      if(err.name === 'CastError') return next({status: 404, msg: `article ${id} cannot be found. Your comment has not been added`})
      next(err)
    })
    }

  exports.changeVotesArticle = (req, res, next) => {
    let count;
    let id = req.params.article_id
    if(id.length !== 24 || !(/(^[0-9])(?=.*[0-9]).+(?=.*[a-z])/g).test (id.toString()) || id.match(/[^0-9a-z]/i)) next({status: 400, msg: `bad request: ${id} is not a valid article id`})
    req.query.vote === "up" ? count = 1 : req.query.vote === "down" ? count = -1 : next({status: 400, msg: 'Please enter up or down'})
      Article.findByIdAndUpdate(id, { $inc: { votes: count } }, {new: true}).populate('created_by').lean()
      .then(article => {
        if(article === null) {
          next({status: 404, msg:`article ${id} cannot be found. Your vote has not been added`})
        }
        else return addCommentCount(article)
       })
       .then(article => {
         article === undefined ? next({status: 404, msg:`article ${id} cannot be found. Your vote has not been added`}) : 
         res.status(202).send({article})
       })
        .catch((err) => {
          if(err.name === 'CastError') next({status: 404, msg:`article ${id} cannot be found. Your vote has not been added`})
          else next(err)
        })
      }
