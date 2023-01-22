const User = require("../models/user");

exports.facebookCallback = (req, res, next) => {
  res.redirect("/odinbook/profile");
};

exports.getAllUsers = (req, res, next) => {
  User.find().exec((err, allUsers) => {
    if (err) {
      return next(err);
    }
    res.json(allUsers);
  });
};

exports.getAllPendingFriendRequests = (req, res, next) => {
  User.find({ _id: { $in: req.user.pendingFriends } }).exec((err, users) => {
    if (err) {
      return next(err);
    }
    res.json(users);
  });
};

exports.getAllSentFriendRequests = (req, res, next) => {
  User.find({ _id: { $in: req.user.sentFriendReq } }).exec((err, users) => {
    if (err) {
      return next(err);
    }
    res.json(users);
  });
};
