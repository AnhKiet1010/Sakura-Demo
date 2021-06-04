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
    images: {
      type: Array
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
    }
  }
);

module.exports = mongoose.model('Message', messageSchema);