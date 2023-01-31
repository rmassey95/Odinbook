const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("./models/user");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL:
        // "http://localhost:5000/odinbook/facebook/redirect",
        "https://odinbook-backend-c33h.onrender.com/odinbook/facebook/redirect",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ fbProfileId: profile.id }).exec((err, foundUser) => {
        if (err) {
          return cb(err);
        }

        if (foundUser) {
          return cb(null, foundUser);
        }

        const newUser = new User({
          pendingFriends: [],
          sentFriendReqs: [],
          friends: [],
          displayName: profile.displayName,
          fbProfileId: profile.id,
          profileImg: profile.photos[0].value,
        }).save((err) => {
          if (err) {
            return cb(err);
          }
          return cb(null, newUser);
        });
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId, (err, user) => {
    done(err, user);
  });
});
