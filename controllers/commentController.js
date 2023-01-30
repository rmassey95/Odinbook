const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

exports.createComment = [
  body("commentText")
    .isLength({ min: 3 })
    .withMessage("Comment must have a minimum of 3 characters"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json(errors);
    }

    const newComment = new Comment({
      commentText: req.body.commentText,
      likes: [],
      author: req.params.userId,
      datePosted: Date.now(),
      post: req.params.postId,
    });

    newComment.save((err) => {
      if (err) {
        return next(err);
      }

      res.json(newComment);
    });
  },
];

exports.updateComment = [
  body("commentText")
    .isLength({ min: 3 })
    .withMessage("Comment must have a minimum of 3 characters"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json(errors);
    }

    Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        commentText: req.body.commentText,
      },
      (err, updateComment) => {
        if (err) {
          return next(err);
        }

        return res.json(updateComment);
      }
    );
  },
];

exports.deleteComment = (req, res, next) => {
  Comment.findByIdAndRemove(req.params.commentId, (err, deletedComment) => {
    if (err) {
      return next(err);
    }

    res.json(deletedComment);
  });
};

exports.getPostComments = (req, res, next) => {
  Comment.find({ post: req.params.postId })
    .populate("author")
    .exec((err, comments) => {
      if (err) {
        return next(err);
      }
      return res.json(comments);
    });
};

exports.deleteManyComments = (req, res, next) => {
  Comment.deleteMany({ post: req.params.postId }).exec((err, results) => {
    if (err) {
      return next(err);
    }
    return res.json({ postsDeleted: results });
  });
};

exports.getComment = (req, res, next) => {
  Comment.findById(req.params.commentId).exec((err, comment) => {
    if (err) {
      return next(err);
    }
    return res.json(comment);
  });
};

exports.addLikeToComment = (req, res, next) => {
  Comment.findById(req.params.commentId).exec((err, foundComment) => {
    if (err) {
      return next(err);
    }

    if (foundComment.likes.includes(req.params.userId)) {
      return res.json({ liked: true });
    }

    const updatedLikes = foundComment.likes;
    updatedLikes.push(req.params.userId);

    const updatedComment = new Comment({
      _id: foundComment._id,
      commentText: foundComment.commentText,
      likes: updatedLikes,
      author: foundComment.author,
      datePosted: foundComment.datePosted,
      post: foundComment.post,
    });

    Comment.findByIdAndUpdate(
      req.params.commentId,
      updatedComment,
      (err, results) => {
        if (err) {
          return next(err);
        }

        return res.json(results);
      }
    );
  });
};
