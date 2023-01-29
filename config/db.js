require("dotenv").config()
const mongoose = require("mongoose");
const log = require("../logger")

module.exports.connectDB = (uri) =>{
    if(process.env.NODE_ENV = "production"){
       uri = uri.replace("<password>",process.env.DB_PASSWORD)
    }
    mongoose.connect(uri).then(res =>{
        log("info","connected todb")
    }).catch(err =>{
        throw new Error("could not connect to db")
    })
}