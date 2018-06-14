const { Comment } = require("../models");

exports.getComments = (req, res, next) => {
  Comment.find().populate('created_by')
    .then(comments => {
      res.send({ comments });
    })
    .catch(next);
};
exports.getCommentById = (req, res, next) => {
  //console.log("getting comment by id");
  let id = req.params.comment_id
if(id.length !== 24 || !(/(^[0-9])(?=.*[0-9]).+(?=.*[a-z])/g).test (id.toString()) || id.match(/[^0-9a-z]/i)) next({status: 400, msg: `bad request: ${id} is not a valid comment id`})
  Comment.findOne({ _id: id }).populate('created_by')
    .then(comment => {
     comment === null ? next({status: 404, msg: `comment ${id} not found`}) : res.send({ comment });
    })
    .catch((err) => {
      if(err.name === 'CastError') next({status: 400, msg: `bad request: ${id} is not a valid comment id`})
      next(err)
    });
  };

exports.changeVotesComment = (req, res, next) => {
  let count;
  let id = req.params.comment_id
if(id.length !== 24 || !(/(^[0-9])(?=.*[0-9]).+(?=.*[a-z])/g).test (id.toString()) || id.match(/[^0-9a-z]/i)) next({status: 400, msg: `bad request: ${id} is not a valid comment id`})
  req.query.vote === "up" ? count = 1 : req.query.vote === "down" ? count = -1 : next({status: 400, msg: 'Please enter up or down'})
    Comment.findByIdAndUpdate(id, { $inc: { votes: count } }, {new: true}).populate('created_by')
      .then(comment => {
        comment === null ? next({status: 404, msg: `${id} not found`}) : res.status(202).send({ comment });
      })
      .catch(next);
  }


exports.deleteComment = (req, res, next) => {
  //console.log("deleting comment");
  let id = req.params.comment_id
if(id.length !== 24 || !(/(^[0-9])(?=.*[0-9]).+(?=.*[a-z])/g).test (id.toString()) || id.match(/[^0-9a-z]/i)) next({status: 400, msg: `bad request: ${id} is not a valid comment id`})
  Comment.findOne({ _id: id })
.then(comment => {
  if (comment === null) {
let error = new Error(`Comment not found`)
error.status = 404
error.msg = `Comment ${id} not found`
throw error
  }  
  else return Comment.remove({ _id: id })
})
.then(() => {
    res.status(204).send();
  })
  .catch(next)
};
