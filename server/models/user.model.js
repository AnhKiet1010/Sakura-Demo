const mongoose = require('mongoose');

// user schema
const userSchema = new mongoose.Schema(
  {
    lineId : {
        type: String,
        default: ""
    },
    password: {
      type: String
    },
    name: {
      type: String,
      default: "User"
    },
    avatar: {
        type: String
    },
    statusMessage: {
        type: String,
        default: ""
    },
    email: {
        type: String
    },
    lastTime: {
        type: String
    },
    lastMess: {
      type: String,
      default: ""
    }
  }
);

module.exports = mongoose.model('User', userSchema);