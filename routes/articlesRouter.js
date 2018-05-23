const router = require('express').Router()
const {getArticles, getArticleById, getCommentsByArticleId} = require('../controllers')

router.get('/', getArticles)
router.get('/:article_id', getArticleById)// ------ Get an individual article
router.get('/:article_id/comments', getCommentsByArticleId)//Get all the comments for a individual article


module.exports = router;