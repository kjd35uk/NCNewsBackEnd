const { Topic, Article } = require("../models");

exports.getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.send({ topics });
    })
    .catch(console.log);
};

exports.getArticlesByTopic = (req, res, next) => {
  console.log("getting articles", req.params);
  Article.find({ belongs_to: req.params.topic })
    .then(articles => {
      res.send({ articles });
    })
    .catch(console.log);
};

exports.addArticlesToTopic = (req, res, next) => {
  console.log("adding articles to comment");
  const newArticle = new Article({
    title: req.body.title,
    body: req.body.body,
    belongs_to: req.params.topic,
    created_by: "5b0584f799b179c3ae3b4227"
  });
  return Article.create(newArticle)
    .then(article => {
      res.status(201).send({ article });
    })
    .catch(console.log);
};
