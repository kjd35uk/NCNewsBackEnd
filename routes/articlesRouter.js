const router = require('express').Router()
const {getArticles, getArticleById, getCommentsByArticleId, addCommentToArticle, changeVotes} = require('../controllers')

router.get('/', getArticles)
router.get('/:article_id', getArticleById)// ------ Get an individual article
router.get('/:article_id/comments', getCommentsByArticleId)//Get all the comments for a individual article
router.post('/:article_id/comments', addCommentToArticle)//- Add a new comment to an article. 
router.put('/:article_id', changeVotes)
// PUT /api/articles/:article_id ------ Increment or Decrement the votes of an article by one. This route requires a vote query of 'up' or 'down'
// e.g: `/api/articles/:article_id?vote=up`

module.exports = router;