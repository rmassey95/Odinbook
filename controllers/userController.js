const User = require("../models/user");
const async = require("async");

exports.facebookCallback = (req, res, next) => {
  res.redirect("http://localhost:5000/odinbook/test");
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
  User.find({ _id: { $in: req.user.sendFriendReqs } }).exec((err, users) => {
    if (err) {
      return next(err);
    }
    res.json(users);
  });
};

exports.addFriend = (req, res, next) => {
  async.parallel(
    {
      currentUser(cb) {
        User.findById(req.params.userId, cb);
      },
      addedUser(cb) {
        User.findById(req.params.friendId, cb);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      const newCurrentFriendList = results.currentUser.friends;
      newCurrentFriendList.push(req.params.friendId);
      const newCurrentPendingFriends =
        results.currentUser.pendingFriends.filter(
          (friend) => friend != req.params.friendId
        );

      const newAddedFriendList = results.addedUser.friends;
      newAddedFriendList.push(req.params.userId);
      const newAddedSendFriendsReqs = results.addedUser.sendFriendReqs.filter(
        (friend) => friend != req.params.userId
      );

      async.parallel(
        {
          updateCurrentUser(cb) {
            User.findByIdAndUpdate(
              req.params.userId,
              {
                friends: newCurrentFriendList,
                pendingFriends: newCurrentPendingFriends,
              },
              cb
            );
          },
          updateAddedUser(cb) {
            User.findByIdAndUpdate(
              req.params.friendId,
              {
                friends: newAddedFriendList,
                sendFriendReqs: newAddedSendFriendsReqs,
              },
              cb
            );
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.json(results);
        }
      );
    }
  );
};

exports.sendFriendRequest = (req, res, next) => {
  User.findById(req.params.userId).exec((err, currentUser) => {
    if (
      currentUser.friends.includes(req.params.friendId) ||
      currentUser.pendingFriends.includes(req.params.friendId) ||
      currentUser.sendFriendReqs.includes(req.params.friendId)
    ) {
      return res.json({ added: true });
    } else {
      async.parallel(
        {
          updateCurrentUser(cb) {
            User.findByIdAndUpdate(
              req.params.userId,
              {
                $push: { sendFriendReqs: [req.params.friendId] },
              },
              cb
            );
          },
          updateAddedUser(cb) {
            User.findByIdAndUpdate(
              req.params.friendId,
              {
                $push: { pendingFriends: [req.params.userId] },
              },
              cb
            );
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.json(results);
        }
      );
    }
  });
};

exports.getAllFriends = (req, res, next) => {
  User.find({ friends: { $in: req.params.userId } }).exec((err, foundUsers) => {
    if (err) {
      return next(err);
    }

    return res.json(foundUsers);
  });
};

exports.updateProfileImg = (req, res, next) => {
  User.findByIdAndUpdate(req.params.userId, {
    profileImg: req.body.profileImg,
  }).exec((err, result) => {
    if (err) {
      return next(err);
    }
    return res.json(result);
  });
};

exports.getUserInfo = (req, res, next) => {
  User.findById(req.params.userId).exec((err, userInfo) => {
    if (err) {
      return next(err);
    }
    return res.json(userInfo);
  });
};
