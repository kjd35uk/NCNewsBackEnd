const router = require("express").Router();
const {
  getTopics,
  getArticlesByTopic,
  addArticlesToTopic
} = require("../controllers/topics");

router.get("/", getTopics);
router.get("/:topic/articles", getArticlesByTopic);
router.post("/:topic/articles", addArticlesToTopic);

router.use('/*', (req, res, next) => {
  next({status: 404, msg: 'Page not found'})
})

module.exports = router;
