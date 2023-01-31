require("dotenv").config();

const path = require("path");
const express = require("express");
const cookieSession = require("cookie-session");
const passport = require("passport");
const passportSetup = require("./passport-config");
const odinbookRouter = require("./routes/odinbookRouter");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const port = process.env.PORT || 3001;

const app = express();

const mongoose = require("mongoose");

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["thisappisawesome"],
//     maxAge: 24 * 60 * 60 * 100,
//   })
// );

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,PUT,POST,DELETE",
    credentials: true,
  })
);

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