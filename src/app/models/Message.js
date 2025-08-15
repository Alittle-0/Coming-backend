const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Message = new mongoose.Schema({
    channelId: {
      type: String,
      required: true,
      index: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    user: {
      id: {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: true
      },
      avatar: {
        type: String,
        default: null
      }
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
  }, {
    timestamps: true
  });
  
  // Index for faster queries
  Message.index({ channelId: 1, createdAt: -1 });
  
  module.exports = mongoose.model('Message', Message);