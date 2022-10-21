const mongoose = require("mongoose")
const stripe = require("stripe")

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    product:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"product",
        required:true
    },
    quantity:{
        type:Number,
        min:1,
        default:1
    },
    sessionID:{
        type:String
    },
    status:{
        type:String,
        enum:["active","pending","cancelled"],
        required:true,
        default:"pending"
    },
    // handler:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"admin",
    // }
},{
    timestamps:true,
    virtuals:true
})

orderSchema.virtual("session").get(async function(){
    return stripe.checkout.sessions.retrieve(this.sessionID)
})
orderSchema.methods.listLineItems = async function(){
    return stripe.checkout.sessions.listLineItems(this.sessionID)
}

module.exports = mongoose.model("order",orderSchema)