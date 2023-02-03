require("dotenv").config();

const path = require("path");
const express = require("express");
const passport = require("passport");
const passportSetup = require("./passport-config");
const odinbookRouter = require("./routes/odinbookRouter");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const port = process.env.PORT || 3001;
const MongoStore = require("connect-mongo");

const app = express();

const mongoose = require("mongoose");
const { allowedNodeEnvironmentFlags } = require("process");

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: "GET,PUT,POST,DELETE",
//     credentials: true,
//   })
// );

app.use((req, res, next) => {
  // allow CORS for React App
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // allow crendentials to be sent
  res.setHeader("Access-Control-Allow-Credentials", "true");
  // allow header to be set in React App
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(compression()); // Compress all routes
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(express.json());

app.use("/odinbook", odinbookRouter);

app.get("/", (req, res) => {
  res.send("HOMEPAGE");
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
