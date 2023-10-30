require("dotenv").config()
const mongoose = require("mongoose");
const log = require("../logger")

module.exports.connectDB = (uri) =>{
    return mongoose.connect(uri)
}