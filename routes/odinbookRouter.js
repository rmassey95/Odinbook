const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const CLIENT_HOMEPAGE_URL = "http://localhost:3000/odinbook";
const multer = require("multer");
const path = require("path");

const upload = multer({ dest: `${path.resolve("public/")}/images` });

const isAuthorized = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).json({ authenticated: false });
  }
};

// post router
router.get("/post/:postId", postController.getSinglePost);

router.get(
  "/profile/:userId/timeline",
  isAuthorized,
  postController.getTimelinePosts
);

router.get("/profile/all-posts", postController.getAllPosts);

router.get("/profile/:userId", isAuthorized, postController.getProfileInfo);

router.post(
  "/post/:userId/create",
  isAuthorized,
  upload.single("image"),
  postController.createPost
);

router.put("/post/update/:postId", isAuthorized, postController.updatePost);

router.delete("/post/delete/:postId", isAuthorized, postController.deletePost);

router.put(
  "/post/:userId/add-like/:postId",
  isAuthorized,
  postController.addLikeToPost
);

// comment router
router.get("/comments/all/:postId", commentController.getPostComments);

router.post(
  "/comment/:userId/create/:postId",
  isAuthorized,
  commentController.createComment
);

router.put(
  "/comment/update/:commentId",
  isAuthorized,
  commentController.updateComment
);

router.delete(
  "/comment/delete/:commentId",
  isAuthorized,
  commentController.deleteComment
);

router.delete(
  "/comments/:postId",
  isAuthorized,
  commentController.deleteManyComments
);

router.put(
  "/comment/:userId/add-like/:commentId",
  isAuthorized,
  commentController.addLikeToComment
);

router.get("/comment/:commentId", isAuthorized, commentController.getComment);

// users router
router.get("/user/:userId", isAuthorized, userController.getUserInfo);

router.put(
  "/user/update-img/:userId",
  isAuthorized,
  userController.updateProfileImg
);

router.get("/users", userController.getAllUsers);

router.get(
  "/users/pending-requests",
  isAuthorized,
  userController.getAllPendingFriendRequests
);

router.get("/user/friends/:userId", isAuthorized, userController.getAllFriends);

router.put(
  "/user/:userId/accept/:friendId",
  isAuthorized,
  userController.addFriend
);

router.put(
  "/user/:userId/send/:friendId",
  isAuthorized,
  userController.sendFriendRequest
);

router.get(
  "/users/sent-requests",
  isAuthorized,
  userController.getAllSentFriendRequests
);

// FB login
router.get("/login/success", (req, res) => {
  console.log(req);
  if (req.user) {
    return res
      .status(200)
      .json({ sucess: true, user: req.user, cookies: req.cookies });
  } else {
    return res.status(401).json({ authenticated: false });
  }
});

router.get("/facebook", passport.authenticate("facebook"));

// redirect to home page after successfully login via facebook
router.get(
  "/facebook/redirect",
  passport.authenticate("facebook", {
    failureRedirect: "/odinbook/login/failed",
  }),
  (req, res, next) => {
    res.redirect(CLIENT_HOMEPAGE_URL);
  }
);

// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate.",
  });
});

// logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_HOMEPAGE_URL);
});

module.exports = router;
