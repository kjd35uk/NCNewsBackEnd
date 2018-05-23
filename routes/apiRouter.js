const router = require('express').Router()
const commentsRouter = require('./commentsRouter')
const articlesRouter = require('./articlesRouter')
const usersRouter = require('./usersRouter')
const topicsRouter = require('./topicsRouter')


router.use('/comments', commentsRouter)
router.use('/articles', articlesRouter)
router.use('/users', usersRouter)
router.use('/topics', topicsRouter)


module.exports = router;