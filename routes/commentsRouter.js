const router = require("express").Router();
const {
  getComments,
  getCommentById,
  changeVotesComment,
  deleteComment
} = require("../controllers/comments");

router.get("/", getComments);
router.get("/:comment_id", getCommentById);
router.put("/:comment_id", changeVotesComment);
router.delete("/:comment_id", deleteComment);


router.use('/*', (req, res, next) => {
  next({status: 404, msg: 'Page not found'})
})

module.exports = router;
