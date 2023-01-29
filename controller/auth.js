require("dotenv").config()
const bcrypt = require("bcrypt")
const { User } = require("../models/user")
const Admin = require("../models/admin")
const {validateUser, validateAdmin} = require("../util/validators")
const _ = require("lodash")
const {sendMail} = require("../util/email")
const crypto = require("crypto")

console.log(process.env.NODE_ENV)


module.exports.login = async(req,res) =>{
    const {email,password} = req.body;
    if(!email || !password)return res.status(400).json({message:"please provide email and password"})
    const user = await User.findOne({email});
    if(!user)return res.status(404).json({message:"sorry, this email is not registered"})
    const passwordIsCorrect = await bcrypt.compare(password,user.password)
    console.log({passwordIsCorrect,password,userP:user.password})
    if(!passwordIsCorrect) return res.status(400).json({message:"incorrect password"})
    const token = await user.genToken(user._id)
    await sendCookie(token,res)
    return res.status(200).json({data:_.pick(user,[ "username", "email", "_id","picture","cart","whitelist","_kind"]),token})
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
    return res.status(200).json({data:_.pick(newUser,["email","username","picture","cart","whitelist"]),token})
}

module.exports.adminRegister = async(req,res) =>{
    const validate = validateAdmin(req.body)
    if(validate.error) return res.status(400).json({message:"invalid credentials"})
    const exists = await User.findOne({email:req.body.email,_kind:"admin"})
    if(exists) return res.status(401).json({message:"sorry, this email is taken"})
    const newUser = await Admin.create({...req.body})
    const token = await newUser.genToken(newUser._id)
    await sendMail(newUser.email,"admin-welcome",_.pick(newUser,["firstName","lastName","email"]))
    await sendCookie(token,res)
    return res.status(200).json({data:_.pick(newUser,["email","username","picture","cart","whitelist","_kind"]),token})
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
    await sendCookie(token,res)
    return res.status(200).json({data:_.pick(admin,["email","_kind","username"]),token})
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

module.exports.forgetPassword = async(req,res) =>{
    const {email} = req.body;
    if(!email)return res.status(400).json({message:"please provide your email address"})
    const user = await User.findOne({email})
    if(!user) return res.status(400).json({message:"email is not registered"})
    let token = crypto.randomBytes(20).toString("hex")
    user.passwordResetToken = token;
    user.tokenExpireTime = Date.now() + (1000*60*60*2) //token expires in 2 hrs
    await user.save()
    console.log(user)
    const resetUrl = `${process.env.APP_UI_URL}/forget-password/${token}`
    await sendMail(email,"forget-password",{resetUrl})
    return res.status(200).json({message:`please check ${email} inbox`})
}

module.exports.forgetPasswordCallback = async(req,res) =>{
    const {token} = req.params
    if(!token) return res.status(403).json({message:"pleave provide a token"})
    const user = await User.findOne({passwordResetToken:token,tokenExpireTime:{$gte:Date.now()}})
    if(!user)return res.status(400).json({message:"user token expired"})
    return res.status(200).json({message:"token confirmed continue to password reset"})
}

module.exports.resetPassword = async(req,res)=>{
    const {password, confirmPassword} = req.body;
    if(!password || !confirmPassword) return res.status(400).json({message:"please provide password and confirm password"})
    if(password !== confirmPassword)return res.status(400).json({message:"password and confirm-password must match"})
    let user = await User.findOne({passwordResetToken:req.params.token,tokenExpireTime:{$gte:Date.now()}})
    if(!user)return res.status(403).json({message:"token expired"})
    user.password = password;
    user.passwordResetToken = undefined;
    user.tokenExpireTime = undefined;
    user = await user.save()
    console.log({user})
    return res.status(200).json({message:"passord reset successful",data:user})
}

function sendCookie(payload,res){
    res.set("x-auth-token",payload)
    return res.cookie("x-auth-token",payload,{expires:process.env.AGE * 1000})
}