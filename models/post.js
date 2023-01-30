const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  content: { type: String, required: true, minLength: 3, trim: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  author: { type: Schema.Types.ObjectId, ref: "User" },
  datePosted: { type: Date, default: Date.now() },
  img: { type: String },
});

module.exports = mongoose.model("Post", PostSchema);
