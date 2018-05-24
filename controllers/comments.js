const { Comment } = require("../models");

exports.getComments = (req, res, next) => {
  Comment.find()
    .then(comments => {
      res.send({ comments });
    })
    .catch(console.log);
};

exports.changeVotesComment = (req, res, next) => {
  if (req.query.vote === "up") {
    Comment.findByIdAndUpdate(req.params.comment_id, { $inc: { votes: 1 } })
      .then(comment => {
        res.status(202).send({ comment });
      })
      .catch(console.log);
  } else if (req.query.vote === "down") {
    Comment.findByIdAndUpdate(req.params.comment_id, {
      $inc: { votes: -1 }
    })
      .then(comment => {
        res.status(202).send({ comment });
      })
      .catch(console.log);
  }
};

exports.deleteComment = (req, res, next) => {
  console.log("deleting comment");
  Comment.remove({ _id: req.params.comment_id }).then(() => {
    res.status(400).send("Your selected comment has been deleted");
  });
};
