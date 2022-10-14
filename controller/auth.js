require("dotenv").config()
const bcrypt = require("bcrypt")
const { User, Admin } = require("../models/user")
const {validateUser} = require("../util/validators")
const passport = require("passport")
const _ = require("lodash")
const jwt = require("jsonwebtoken")


module.exports.login = async(req,res) =>{
    console.log("login route reached")
    const {email,password} = req.body;
    if(!email || !password)return res.status(400).json({message:"please provide email and password"})
    const user = await User.findOne({email});
    if(!user)return res.status(404).json({message:"sorry, this email is not registered"})
    const passwordIsCorrect = await bcrypt.compare(password,user.password)
    if(!passwordIsCorrect) return res.status(400).json({message:"incorrect password"})
    const token = await user.genToken(user._id)
    await sendCookie(token,res)
    return res.status(200).json(_.pick(user,[ "username", "email", "_id","picture","cart","whitelist","_kind"]))
}


module.exports.register = async(req,res) =>{
    const validate = validateUser(req.body)
    if(validate.error) return res.status(400).json({message:"invalid credentials"})
    const {username,email,password} = req.body
    const exists = await User.findOne({email})
    if(exists) return res.status(401).json({message:"sorry, this email is taken"})
    const newUser = await User.create({username, email, password})
    const token = await newUser.genToken(newUser._id)
    await sendCookie(token,res)
    return res.status(200).json(_.pick(newUser,["email","username","picture","cart","whitelist"]))
}
module.exports.adminRegister = async(req,res) =>{
    const validate = validateUser(req.body)
    if(validate.error) return res.status(400).json({message:"invalid credentials"})
    const {username,email,password} = req.body
    if(!username)return res.status(400).json({message:"please provide a username"})
    const exists = await User.findOne({email,_kind:"admin"})
    if(exists) return res.status(401).json({message:"sorry, this email is taken"})
    const newUser = await Admin.create({username, email, password})
    const token = await newUser.genToken(newUser._id)
    await sendCookie(token,res)
    return res.status(200).json(_.pick(newUser,["email","username","picture","cart","whitelist","_kind"]))
}

module.exports.logout = async(req,res) =>{
    if(!req.user) return res.status(400).json({message:"you are not logged in"})
    await res.cookie("authenticate",{},{expires:new Date()})
    return res.status(200).json({message:"logged out"})
}
module.exports.adminlogin = async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).json({message:"please provide email and password"})
    const admin = await Admin.findOne({email})
    if(!admin)return res.status(404).json({message:"sorry,no account registered with this email "})
    if(!admin._kind || admin._kind?.toLowerCase() !== "admin")return res.status(403).json({message:"you're not cleared as an admin, login as a user"})
    const token = await admin.genToken(admin._id)
    console.log(token)
    await sendCookie(token,res)
    return res.status(200).json({data:_.pick(admin,["email","_kind","username"])})
}
module.exports.passportRedirect = async(req,res) =>{
    const user = req.user
    if(!user) return res.status(500).json({message:"server error"})
    const exists = await User.findOne({...user})
    if(!exists){
        const newUser = await User.create(user)
        if(!newUser)return res.status(500).json({message:"error:internal server error"})
        return res.status(200).json(_.pick(newUser,["email","username","picture","_kind"]))
    }
    return res.status(200).json(exists,["email","username","picture","_kind"])
}

function sendCookie(payload,res){
    return res.cookie("authenticate",payload,{expires:process.env.AGE * 1000})
}