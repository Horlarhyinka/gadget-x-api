require("dotenv").config()
const { User } = require("../models/user")
const {extractToken} = require("../util/auth")
const jwt = require("jsonwebtoken")
require("dotenv").config()


module.exports.authenticate = async(req,res,next) =>{

    const sendUnauthenticated = async() =>{
        return res.status(401).json({message:"unauthenticated"})
    }
    if(!req.headers.cookie && !req.headers["x-auth-token"]) return sendUnauthenticated()
    const token =  req.headers["x-auth-token"] || extractToken(req.headers.cookie)
    if(!token) return sendUnauthenticated()
    const isAuth = jwt.verify(token,process.env.SECRET)
    if(!isAuth.payload) return sendUnauthenticated()
    const user = await User.findById(isAuth.payload)
    if(!user) return sendUnauthenticated()
    req.user = user
    next()
}