const { Topic, Article } = require("../models");

exports.getTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      if(topics !== null) res.send({ topics });
    })
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  if(!isNaN(+req.params.topic)) next({status: 400, msg: `bad request: ${req.params.topic} is not a string`})
  Article.find({ belongs_to: req.params.topic })
    .then(articles => {
      articles.length === 0 ? next({status: 404, msg: `${req.params.topic} not found`}) : res.send({ articles });
    })
   .catch(next)
};

exports.addArticlesToTopic = (req, res, next) => {
  console.log("adding articles");
  if(!isNaN(+req.params.topic)) next({status: 400, msg: `bad request: ${req.params.topic} is not a string`})
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
    .catch(next);
};
