const mongoose = require('mongoose');

const notiSchema = new mongoose.Schema(
  {
    fromId: {
      type: String
    },
    toId: {
      type: String
    },
    seen: {
      type: Boolean,
      default: false
    },
    type: {
      type: String
    }
  }
);

module.exports = mongoose.model('Noti', notiSchema);