const mongoose = require('mongoose');

// Mess schema
const messageSchema = new mongoose.Schema(
  {
    receive : {
        type: String
    },
    author: {
      type: String
    },
    time: {
      type: String,
    },
    type: {
      type: String
    },
    content: {
      type: String
    },
    img: {
      type: String
    },
    seen: {
        type: Boolean
    },
    link: {
      type: String
    },
    react: {
      type: String,
      default: ""
    },
    reply: {
      type: String,
       default: ""
    },
    active: {
      type: Boolean,
      default: true
    },
    recall: {
      type: Boolean,
      default: false
    }
  }
);

module.exports = mongoose.model('Message', messageSchema);