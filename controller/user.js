require("dotenv").config()
const bcrypt = require("bcrypt")
const { User, Admin } = require("../models/user")
const {validateUser} = require("../util/validators")
const passport = require("passport")
const _ = require("lodash")
const jwt = require("jsonwebtoken")
const { rest } = require("lodash")


module.exports.login = async(req,res) =>{
    const {email,password} = req.body;
    if(!email || !password)return rest.status(400).json({message:"please provide username and password"})
    const user = await User.findOne({email});
    if(!user)return res.status(404).json({message:"sorry, there is no account registered with this email"})
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
    if(!username)return res.status(400).json({message:"please provide a username"})
    const exists = await User.find({email})
    if(exists.length) return res.status(401).json({message:"sorry, this email is taken"})
    const newUser = await User.create({username, email, password})
    const token = await newUser.genToken(newUser._id)
    await sendCookie(token,res)
    return res.status(200).json(_.pick(newUser,["email","username","picture","cart","whitelist"]))
}

module.exports.logout = async(req,res) =>{
    if(!req.user) return res.status(400).json({message:"you are not logged in"})
    await res.cookie("authenticate",{},{expires:new Date()})
    return res.status(200).json({message:"logged out"})
}
module.exports.adminlogin = async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).json({message:"please provide emailand password"})
    const admin = await Admin.findOne({email})
    if(!admin)return res.status(404).json({message:"sorry,no account registered with this email "})
    if(!admin._kind || admin._kind?.toLowerCase() !== "admin")return res.status(403).json({message:"you're not cleared as an admin, login as a user"})
    const token = await admin.genToken(admin._id)
    console.log(token)
    await sendCookie(token,res)
    return res.status(200).json({data:_.pick(admin,["email","_kind","username"])})
}
module.exports.adminRegister = async(req,res)=>{
    const validate = validateUser(req.body)
    if(validate.error)return res.status(400).json({message:"invalid credentials"})
    const user = Admin.findOne({email:req.body.email})
    if(user)return res.status(400).json({message:"sorry, email is taken"})
    const newUser = await Admin.create(req.body)
    const token = await newUser.genToken(newUser._id)
    sendCookie(token,res)
    return res.status(200).json({data:_.pick(newUser,["email","username","_kind"])})


}

// User.find().then(res =>{
//     res.map(user=>{
//         User.findOneAndRemove(user).then(()=>{console.log("user deleted")})
//     })
// })

function sendCookie(payload,res){
    return res.cookie("authenticate",payload,{expires:process.env.AGE * 1000})
}