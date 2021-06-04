const mongoose = require('mongoose');

// user schema
const userSchema = new mongoose.Schema(
  {
    socialRegister: {
      type: Boolean,
      default: false
    },
    socialInfo: {
      socialName: String,
      socialId: String
    },
    password: String,
    name: {
      type: String,
      default: "User"
    },
    avatar: {
      type: String,
      default: "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"
    },
    email: String,
    lastActivity: {
      type: Date,
      default: new Date()
    },
    online: {
      type: Boolean,
      default: false
    },
    contacts: {
      type: Array,
      default: []
    },
    socketId: {
      type: String
    },
  }
);

module.exports = mongoose.model('User', userSchema);