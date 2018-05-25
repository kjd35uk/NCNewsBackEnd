const router = require("express").Router();
const { getUsers, getUserByUsername } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:username", getUserByUsername);

router.use('/*', (req, res, next) => {
  next({status: 404, msg: 'Page not found'})
})

module.exports = router;
