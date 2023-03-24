require("dotenv").config()
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Product = require("./product");
const {validateUser} = require("../util/validators")

const userSchema = new mongoose.Schema({

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
    whitelist:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"product"
    },
    orders:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"order"
    },
    cart:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"product"
    },
    history:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"order"
    },
    tokenExpireTime:{
        type:Date
    }
},{
    timestamps:true,
    discriminatorKey:"_kind"
})

userSchema.pre("save", async function(){
const salt = await bcrypt.genSalt(10);
this.password = await bcrypt.hash(this.password,salt)
})

userSchema.methods.genToken = async (payload) =>{
    return jwt.sign({payload},process.env.SECRET,{expiresIn:Date.now() + 2 * 60 * 60})
}
userSchema.methods.validateInfo = async(req,res) =>{
    const validate = validateUser(req.body)
    if(validate.error) return res.status(400).json({message:"invalid credentials"})
}


module.exports.User = mongoose.model("user",userSchema)
