const router = require("express").Router();
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  addCommentToArticle,
  changeVotesArticle
} = require("../controllers/articles");

router.get("/", getArticles);
router.get("/:article_id", getArticleById); // Get an individual article
router.get("/:article_id/comments", getCommentsByArticleId); //Get all the comments for an individual article
router.post("/:article_id/comments", addCommentToArticle); // Add a new comment to an article.
router.put("/:article_id", changeVotesArticle); //Increment or Decrement the votes of an article by one.

router.use('/*', (req, res, next) => {
  next({status: 404, msg: 'Page not found'})
})

module.exports = router;
