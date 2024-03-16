const mongoose = require("mongoose");

module.exports = mongoose.model('Docs', {
  _id: String, // Assuming _id is a string for simplicity
       name:String,
      data: String // Assuming data is a string for simplicity
    });