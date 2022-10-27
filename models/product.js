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
        type:Object,
        default:{}
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
        enum:["Phones and Tablets","Laptops and MacBooks","Watches","Headphones","Power Banks","Others"],
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
        type:Object,
        default:{}
    },
    moreInfo:{
        type:Object,
        default:{}
    }
},
{
    timestamps:true
}
)

productSchema.statics.getPaymentDetails = async function(id){
    const prod = await this.findById(id)
    if(!prod)throw new Error("could not get payment details")
    return {
        price: prod.priceID
    }
}


module.exports.Product = mongoose.model("product",productSchema)