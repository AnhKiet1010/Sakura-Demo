const mongoose = require('mongoose');

const converSchema = new mongoose.Schema(
  {
    members: {
      type: Array
    },
    lastMess: {
      type: String,
      default: ""
    }
  }
);

module.exports = mongoose.model('Conver', converSchema);