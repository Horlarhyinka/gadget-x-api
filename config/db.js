require("dotenv").config()
const mongoose = require("mongoose");
const log = require("../logger")


module.exports.connectDB = (uri) =>{
const options = {mongoUrl: uri}
    return mongoose.connect(options.mongoUrl, options)
}