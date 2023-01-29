const mongoose = require("mongoose")

const newsLetterSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    }
},{
    timestamps:false
})

module.exports = mongoose.model("newsletter",newsLetterSchema)