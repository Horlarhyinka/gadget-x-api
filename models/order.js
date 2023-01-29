const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        // required:true
    },
    items:{
        type:Array,
        required:true,
        minLength:1
    },
    reference:{
        type:String,
        required:[true,"please provide a reference"]
    },
    status:{
        type:String,
        required:true,
        enum:["success","Success","successful","Successful","failed","Failed"]
    }
},{
    timestamps:true,
    virtuals:true
})

orderSchema.virtual("total").get(async function(){
    return this.items?.reduce((sum,itm)=>sum += itm,0)
})


module.exports = mongoose.model("order",orderSchema)