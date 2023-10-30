require("dotenv").config();
const mongoose = require("mongoose");
const log = require("../logger");

module.exports.connectDB = (uri) => {
  const options = { useNewUrlParser: true, useUnifiedTopology: true }; // Add the necessary options

  return mongoose.connect(uri, options);
};
