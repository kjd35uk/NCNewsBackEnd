const { User } = require("../models");

exports.getUsers = (req, res, next) => {
  User.find()
    .then(users => {
      res.send({ users });
    })
    .catch(console.log);
};

exports.getUserByUsername = (req, res, next) => {
  console.log(req.params, "getting user by username");
  User.findOne({ username: req.params.username })
    .then(user => {
      res.send({ user });
    })
    .catch(console.log);
};
