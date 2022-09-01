require("dotenv").config()
const bcrypt = require("bcrypt")
const { User } = require("../models/user")
const {validateUser} = require("../util/validators")
const passport = require("passport")
const _ = require("lodash")
const jwt = require("jsonwebtoken")


module.exports.login = async(req,res) =>{
    const validate = validateUser(req.body)
    if(validate.error)return res.status(400).json({message:"invalid credentials"})
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user)return res.status(404).json({message:"sorry, there is no account registered with this email"})
    const passwordIsCorrect = await bcrypt.compare(password,user.password)
    if(!passwordIsCorrect) return res.status(400).json({message:"incorrect password"})
    const token = await jwt.sign({payload:user._id},process.env.SECRET,{expiresIn: 2 * 60 * 60})
    res.cookie("authenticate",token,{expires:process.env.AGE * 1000})
    return res.status(200).json(_.pick(user,[ "username", "email", "_id","picture","cart","whitelist"]))
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
    res.cookie("authenticate",token,{expires:process.env.AGE * 1000})
    return res.status(200).json(_.pick(newUser,["email","username","picture","cart","whitelist"]))
}

module.exports.logout = async(req,res) =>{
    if(!req.user) return res.status(400).json({message:"you are not logged in"})
    res.cookie("authenticate",{},{expires:new Date()})
    return res.status(200).json({message:"logged out"})
}

// User.find().then(res =>{
//     res.map(user=>{
//         User.findOneAndRemove(user).then(()=>{console.log("user deleted")})
//     })
// })