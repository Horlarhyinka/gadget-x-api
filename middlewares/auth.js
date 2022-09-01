require("dotenv").config()
const jwt = require("jsonwebtoken")
const passport = require("passport")
const { User } = require("../models/user")
const {readCookie} = require("../util/readcookie")
const {verifyJwt} = require("../util/validators")

module.exports.authenticate = async(req,res,next) =>{
    if(!req.headers.cookie) return res.status(401).json({message:"unauthenticated"})
    const cookie = readCookie(req.headers.cookie,"authenticate")
    const isAuth = await verifyJwt(cookie,res)
    if(!isAuth.payload) return res.status(400).json({message:"unauthenticated"})
    req.user = await User.findById(isAuth.payload)
    next()
}
module.exports.usePassport = passport.authenticate("google",{ scope:["profile","email"] } )
