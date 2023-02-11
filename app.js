require("dotenv").config();

const path = require("path");
const express = require("express");
const passport = require("passport");
const passportSetup = require("./passport-config");
const odinbookRouter = require("./routes/odinbookRouter");
const bodyParser = require("body-parser");
const session = require("express-session");
const compression = require("compression");
const helmet = require("helmet");
const port = process.env.PORT || 3001;
const MongoStore = require("connect-mongo");

const app = express();
app.set("trust proxy", 1);

const mongoose = require("mongoose");

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: 12 * 60 * 60 * 1000,
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    saveUninitialized: false,
    resave: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

app.use((req, res, next) => {
  // allow CORS for React App
  res.setHeader("Access-Control-Allow-Origin", process.env.DOMAIN_URL);
  // allow crendentials to be sent
  res.setHeader("Access-Control-Allow-Credentials", true);
  // allow header to be set in React App
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // allowed headers in requests
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});

app.use(compression()); // Compress all routes
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(express.json());

app.use("/odinbook", odinbookRouter);

app.listen(port, () => {
  console.log("Listening on port " + port);
});
