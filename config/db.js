require("dotenv").config()
const mongoose = require("mongoose");
const log = require("../logger")

module.exports.connectDB = (uri) =>{
    // if(process.env.NODE_ENV === "production"){
       uri = uri.replace("<password>",process.env.DB_PASSWORD)
    // }
    return mongoose.connect(uri)
}