const { Comment } = require("../models");

exports.getComments = (req, res, next) => {
  Comment.find()
    .then(comments => {
      res.send({ comments });
    })
    .catch(next);
};
exports.getCommentById = (req, res, next) => {
  console.log("getting comment by id");
  Comment.findOne({ _id: req.params.comment_id })
    .then(comment => {
     comment === null ? next({status: 404, msg: `${req.params.comment_id} not found`}) : res.send({ comment });
    })
    .catch((err) => {
      next({status: 400, msg: `bad request: ${req.params.comment_id} is not a valid comment id`})
    });
  };

exports.changeVotesComment = (req, res, next) => {
  let count;
  req.query.vote === "up" ? count = 1 : req.query.vote === "down" ? count = -1 : next({status: 400, msg: 'Please enter up or down'})
    Comment.findByIdAndUpdate(req.params.comment_id, { $inc: { votes: count } }, {new: true})
      .then(comment => {
        comment === null ? next({status: 404, msg: `${req.params.comment_id} not found`}) : res.status(202).send({ comment });
      })
      .catch(next);
  }


exports.deleteComment = (req, res, next) => {
  console.log("deleting comment", req.params);
  Comment.findOne({ _id: req.params.comment_id })
.then(comment => {
  if (comment === null) {
let error = new Error('Comment not found')
error.status = 404
error.msg = 'Comment not found'
throw error
  }  
  else return Comment.remove({ _id: req.params.comment_id })
})
.then(() => {
    res.status(204).send();
  })
  .catch(next)
};
