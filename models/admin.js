const mongoose = require("mongoose")
const {User} = require("./user")
const adminSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"full name is required"]
    },
    lastName:{
        type:String,
        required:[true,"full name is required"]
    },
})

const admin= User.discriminator("admin",adminSchema)


module.exports = admin