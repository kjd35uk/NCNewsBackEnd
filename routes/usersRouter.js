const router = require("express").Router();
const { getUsers, getUserByUsername, getArticlesByUserId } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:username", getUserByUsername);
router.get("/:username/articles", getArticlesByUserId);

router.use('/*', (req, res, next) => {
  next({status: 404, msg: 'Page not found'})
})

module.exports = router;
