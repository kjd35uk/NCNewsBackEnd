const router = require("express").Router();
const {
  getComments,
  changeVotesComment,
  deleteComment
} = require("../controllers/comments");

router.get("/", getComments);
router.put("/:comment_id", changeVotesComment);
router.delete("/:comment_id", deleteComment);

module.exports = router;
