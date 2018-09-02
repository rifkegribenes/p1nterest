const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PinSchema = new Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  siteUrl: { type: String, required: true },
  description: { type: String },
  userId: { type: String },
  userName: { type: String },
  userAvatarUrl: { type: String },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: [{ type: String }] // array of userIds
});

module.exports = mongoose.model('Pin', PinSchema);