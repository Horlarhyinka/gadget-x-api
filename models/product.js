const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    user:{
        type:Object,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
    reactions:{
        type:String,
        enum:["like","dislike","haha","angry"]
    },
})

const comment = mongoose.model("comment",commentSchema)
module.exports.Comment = comment

module.exports.Product = mongoose.model("product",new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required:true
    },
    category:{
        type:String,
        enum:["Phones & Tablets","Laptops & MacBooks","Wrist watches","Power Banks","Others"],
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    about:{
        type:String,
        minlength:25,
    },
    preview_image_url:{
        type:String,
        required:true,
    },
    more_image_url:[String],
    orders:{
        type:Number,
        min:0,
        default:0
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }],
    reactions:{
        type:[String]
    }
}))