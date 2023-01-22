const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  pendingFriends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  sendFriendReqs: [{ type: Schema.Types.ObjectId, ref: "User" }],
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  displayName: { type: String, required: true },
  fbProfileId: { type: String, required: true },
  profileImg: { type: String },
});

module.exports = mongoose.model("User", UserSchema);
