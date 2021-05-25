const mongoose = require('mongoose');

// store schema
const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String
    },
    images: {
      type: Array,
    },
    description: {
      type: String
    },
    rank: {
      type: String
    },
    address: {
      type: String
    },
    phone: {
      type: String
    },
    category: {
      type: String
    }
  }
);

module.exports = mongoose.model('Store', storeSchema);