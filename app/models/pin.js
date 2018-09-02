const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PinSchema = new Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  userId: { type: String },
  userName: { type: String },
  userAvatarUrl: { type: String },
  likes: [{ type: String }] // array of userIds
});

module.exports = mongoose.model('Pin', PinSchema);