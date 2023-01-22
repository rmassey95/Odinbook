require("dotenv").config();

const express = require("express");
const passport = require("passport");
const odinbookRouter = require("./routes/odinbook");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

const mongoose = require("mongoose");

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
require("./passport-config");
app.use(passport.initialize());
app.use(passport.session());

app.use("/odinbook", odinbookRouter);

app.get("/", (req, res) => {
  res.send("HOMEPAGE");
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
