const mongoose = require('mongoose');

// category schema
const categorySchema = new mongoose.Schema(
  {
    name : {
        type: String
    },
    image: {
      type: String,
    },
  }
);

module.exports = mongoose.model('Category', categorySchema);