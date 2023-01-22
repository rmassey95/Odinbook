require("dotenv").config();

const { faker } = require("@faker-js/faker");
const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");
const async = require("async");

const mongoose = require("mongoose");

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const users = [];
const posts = [];

function createUser(displayName, profileImg, fbProfileId) {
  const newUser = new User({
    pendingFriends: [],
    sendFriendReqs: [],
    friends: [],
    displayName,
    profileImg,
    fbProfileId,
  });
  users.push(newUser);

  newUser.save(function (err) {
    if (err) {
      console.log(err);
    }
  });
}

function populateLikes() {
  const likesArray = [];
  const startPos = Math.floor(Math.random() * users.length);

  for (let i = startPos; i < users.length; i++) {
    likesArray.push(users[i]);
  }

  return likesArray;
}

function createPost(content, datePosted) {
  const newPost = new Post({
    content,
    likes: populateLikes(),
    author: users[Math.floor(Math.random() * users.length)],
    datePosted,
  });

  posts.push(newPost);

  newPost.save(function (err) {
    if (err) {
      console.log(err);
    }
  });
}

function createComment(commentText, datePosted) {
  const newComment = new Comment({
    commentText,
    likes: populateLikes(),
    post: posts[Math.floor(Math.random() * posts.length)],
    author: users[Math.floor(Math.random() * users.length)],
    datePosted,
  });

  newComment.save(function (err) {
    if (err) {
      console.log(err);
    }
  });
}

function createAllUsers(cb) {
  for (let i = 0; i < 50; i++) {
    createUser(
      faker.name.fullName(),
      faker.image.avatar(),
      faker.datatype.uuid()
    );
  }
  cb(null, users);
}

function createAllPosts(cb) {
  for (let i = 0; i < 30; i++) {
    createPost(
      faker.random.words(Math.floor(Math.random() * 100) + 10),
      faker.date.past()
    );
  }
  cb(null, posts);
}

function createAllComments(cb) {
  for (let i = 0; i < 50; i++) {
    createComment(
      faker.random.words(Math.floor(Math.random() * 50) + 5),
      faker.date.past()
    );
  }
  cb(null, 1);
}

async.series(
  [createAllUsers, createAllPosts, createAllComments],
  (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.log("SUCCESS");
    }
  }
);
