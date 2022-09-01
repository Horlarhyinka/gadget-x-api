require("dotenv").config()
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Product = require("./product");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        match:/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    picture:{
        type:String
    },
    whitelist:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    }],
    cart:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    }]
},{
    timestamps:true,
    discriminatorKey:"_kind"
})

userSchema.pre("save", async function(){
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password,salt)
})

userSchema.methods.genToken = async (payload) =>{
    return await jwt.sign({payload},process.env.SECRET,{expiresIn:Date.now() + 2 * 60 * 60})
}


const User = mongoose.model("user",userSchema)
const Admin = User.discriminator("admin",new mongoose.Schema({
    isAdmin:{
        type:Boolean,
        default:true
    }
}))
module.exports = {User, Admin}