const Post = require("../models/post");

exports.getTimelinePosts = (req, res, next) => {
  const findPostAuthorArray = [req.user._id];
  req.user.friends.forEach((friend) => {
    findPostAuthorArray.push(friend);
  });

  Post.find({
    author: { $in: findPostAuthorArray },
  })
    .populate("author")
    .populate("likes")
    .exec((err, posts) => {
      if (err) {
        return next(err);
      }

      res.json(posts);
    });
};

exports.getProfileInfo = (req, res, next) => {
  Post.find({ author: req.user._id }).exec((err, posts) => {
    if (err) {
      return next(err);
    }
    return res.json(posts);
  });
};
