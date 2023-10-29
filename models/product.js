const mongoose = require("mongoose");
const categories = require("../util/categories")
require("./user")
const commentSchema = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    email:{
        type:String,
        
    },
    body:{
        type:String,
        required:true
    },
    reactions:{
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "user",
            default:[]
        },
        dislikes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "user",
            default:[]
        },
    },
},
{
    timestamps:true
})

const comment = mongoose.model("comment",commentSchema)
module.exports.Comment = comment

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required:true
    },
    category:{
        type:String,
        enum:categories,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    preview_image_url:{
        type:String,
        required:true,
    },
    more_images_url:[String],
    orders:{
        type:Number,
        min:0,
        default:0
    },
    quantity:{
        type: Number,
        min:1
    },
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }],
    reactions:{
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "user",
            default:[]
        },
        dislikes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "user",
            default:[]
        },
    },
    description:{
        type:String
    }
},
{
    timestamps:true
}
)

module.exports.Product = mongoose.model("product",productSchema)