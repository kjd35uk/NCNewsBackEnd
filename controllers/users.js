const { User, Article } = require("../models");
const { addCommentCount } = require("../utils");

exports.getUsers = (req, res, next) => {
  User.find()
    .then(users => {
      if (users !== null) res.send({ users });
    })
    .catch(next);
};

exports.getUserByUsername = (req, res, next) => {
  //console.log("getting user by username");
  User.findOne({ username: req.params.username })
    .then(user => {
      res.send({ user });
    })
    .catch(err =>
      next({ status: 404, msg: `${req.params.username} not found` })
    );
};

exports.getArticlesByUserId = (req, res, next) => {
  console.log("getting articles by user id");
  console.log(req.params.username, "REQ");
  Article.find({ created_by: req.params.username })
    .populate("created_by")
    .lean()
    .then(articles => {
      console.log(articles, "ARTICLES");
      return Promise.all([...articles.map(addCommentCount)]);
    })
    .then(articles => {
      articles.length === 0
        ? next({ status: 404, msg: `${req.params._id} not found` })
        : res.send({ articles });
    })
    .catch(next);
};
