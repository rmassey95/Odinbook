const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

exports.getTimelinePosts = (req, res, next) => {
  const findPostAuthorArray = [req.params.userId];
  req.user.friends.forEach((friend) => {
    findPostAuthorArray.push(friend);
  });

  Post.find({
    author: { $in: findPostAuthorArray },
  })
    .populate("author")
    .exec((err, posts) => {
      if (err) {
        return next(err);
      }

      res.json(posts);
    });
};

exports.getSinglePost = (req, res, next) => {
  Post.findById(req.params.postId)
    .populate("author")
    .exec((err, post) => {
      if (err) {
        return next(err);
      }
      return res.json(post);
    });
};

exports.getProfileInfo = (req, res, next) => {
  Post.find({ author: req.params.userId }).exec((err, posts) => {
    if (err) {
      return next(err);
    }
    return res.json(posts);
  });
};

exports.createPost = [
  body("content")
    .isLength({ min: 3 })
    .withMessage("Post must have a minimum of 3 characters"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json(errors);
    }

    const newPost = new Post({
      content: req.body.content,
      likes: [],
      author: req.params.userId,
      img: req.file.filename,
      datePosted: Date.now(),
    });

    newPost.save((err) => {
      if (err) {
        return next(err);
      }
      return res.json(newPost);
    });
  },
];

exports.getAllPosts = (req, res, next) => {
  Post.find()
    .populate("author")
    .exec((err, results) => {
      if (err) {
        return next(err);
      }
      return res.json(results);
    });
};

exports.updatePost = [
  body("content")
    .isLength({ min: 3 })
    .withMessage("Post must have a minimum of 3 characters"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json(errors);
    }

    Post.findByIdAndUpdate(
      req.params.postId,
      {
        content: req.body.content,
      },
      (err, updatedPost) => {
        if (err) {
          return next(err);
        }

        return res.json(updatedPost);
      }
    );
  },
];

exports.deletePost = (req, res, next) => {
  Post.findByIdAndRemove(req.params.postId, (err, deletedPost) => {
    if (err) {
      return next(err);
    }

    return res.json(deletedPost);
  });
};

exports.addLikeToPost = (req, res, next) => {
  Post.findById(req.params.postId).exec((err, foundPost) => {
    if (err) {
      return next(err);
    }

    if (foundPost.likes.includes(req.params.userId)) {
      return res.json({ liked: true });
    }

    const updateLikes = foundPost.likes;
    updateLikes.push(req.params.userId);

    const updatedPost = new Post({
      _id: foundPost._id,
      content: foundPost.content,
      likes: updateLikes,
      author: foundPost.author,
      datePosted: foundPost.datePosted,
    });

    Post.findByIdAndUpdate(
      req.params.postId,
      updatedPost,
      (err, postUpdated) => {
        if (err) {
          return next(err);
        }

        return res.json(postUpdated);
      }
    );
  });
};
