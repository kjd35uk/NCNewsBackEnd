const router = require('express').Router()
const commentsRouter = require('./commentsRouter')
const articlesRouter = require('./articlesRouter')
const usersRouter = require('./usersRouter')
const topicsRouter = require('./topicsRouter')
const routes = require('../utils/apiroutes.json')


router.get("/", (req, res, next) => {
  res.send({ msg: "This is the homepage of Northcoders News" });
});

router.use('/comments', commentsRouter)
router.use('/articles', articlesRouter)
router.use('/users', usersRouter)
router.use('/topics', topicsRouter)



router.use('/*', (req, res, next) => {
  next({status: 404, msg: 'Page not found'})
})


module.exports = router;