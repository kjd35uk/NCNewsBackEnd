const { Article, Comment, Topic, User } = require("../models");

exports.getArticles = (req, res, next) => {
  Article.find().lean()
  .then(articles => {
    return Promise.all([articles, ...articles.map(artObj => Comment.count({ belongs_to: artObj._id }))])
  })
  .then(([articles, ...commentCounts]) => {
    let result = articles.map((artObj, index) => {
     artObj.comments = commentCounts[index]
     return artObj;
  })
  res.send({articles: result})
  })
    }


exports.getArticleById = (req, res, next) => {
  console.log(req.params, "getting article by id");
  Article.findOne({ _id: req.params.article_id })
    .then(article => {
      res.send({ article });
    })
    .catch(console.log);
};

exports.getCommentsByArticleId = (req, res, next) => {
  console.log(req.params, "getting comments by article id");
  Comment.find({ belongs_to: req.params.article_id })
    .then(comments => {
      res.send({ comments });
    })
    .catch(console.log);
};

exports.addCommentToArticle = (req, res, next) => {
  console.log("adding comment to article", req.params, req.body.comment);
  const newComment = new Comment({
    body: req.body.comment,
    belongs_to: req.params.article_id,
    created_at: new Date().getTime()
  });
  return Comment.create(newComment)
    .then(comment => {
      res.status(201).send({ comment });
    })
    .catch(console.log);
};

exports.changeVotesArticle = (req, res, next) => {
  console.log("changing votes", req.params.article_id);
  if (req.query.vote === "up") {
    Article.findByIdAndUpdate(req.params.article_id, { $inc: { votes: 1 } })
      .then(article => {
        res.status(202).send({ msg: "Thanks for your vote!" });
      })
      .catch(console.log);
  } else if (req.query.vote === "down") {
    Article.findByIdAndUpdate(req.params.article_id, {
      $inc: { votes: -1 }
    })
      .then(article => {
        res.status(202).send({ msg: "Thanks for your vote!" });
      })
      .catch(console.log);
  }
};
