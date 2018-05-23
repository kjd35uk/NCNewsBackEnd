const router = require('express').Router()
const {getArticles, getArticleById, getCommentsByArticleId, addCommentToArticle} = require('../controllers')

router.get('/', getArticles)
router.get('/:article_id', getArticleById)// ------ Get an individual article
router.get('/:article_id/comments', getCommentsByArticleId)//Get all the comments for a individual article
router.post('/:article_id/comments', addCommentToArticle)//- Add a new comment to an article. 


module.exports = router;