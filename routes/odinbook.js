const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");

const isAuthorized = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.json({ authenticated: false });
  }
};

// post router
router.get("/profile/timeline", postController.getTimelinePosts);

router.get("/profile/", isAuthorized, postController.getProfileInfo);

// users router
router.get("/users", userController.getAllUsers);

router.get(
  "/users/pending-requests",
  userController.getAllPendingFriendRequests
);

router.get("/users/sent-requests", userController.getAllSentFriendRequests);

// FB login
router.get("/login", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/odinbook/login",
  }),
  userController.facebookCallback
);

// logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.send("Logout Successful");
  });
});

module.exports = router;
