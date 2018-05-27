const { User } = require("../models");

exports.getUsers = (req, res, next) => {
  User.find()
    .then(users => {
      if(users !== null) res.send({ users });
    })
    .catch(next);
};


exports.getUserByUsername = (req, res, next) => {
  //console.log("getting user by username");
  User.findOne({ _id: req.params.username })
    .then(user => {
     res.send({ user });
    })
    .catch(err => 
      next({status: 404, msg: `${req.params.username} not found`}))
  };
