require("dotenv").config()
const { User } = require("../models/user")
const {extractToken} = require("../util/auth")
const {verifyJwt} = require("../util/validators")


module.exports.authenticate = async(req,res,next) =>{
    if(!req.headers.cookie && req.headers["x-auth-token"]) return res.status(401).json({message:"unauthenticated"})
    const token = extractToken(req.headers.cookie,"x-auth-token") || readHeaderToken(req,"x-auth-token")
    const isAuth = await verifyJwt(token,res)
    if(!isAuth.payload) return res.status(401).json({message:"unauthenticated"})
    req.user = await User.findById(isAuth.payload)
    next()
}