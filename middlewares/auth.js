const config = require("../config/config")
const { User } = require("../models/user")
const {extractToken} = require("../util/auth")
const jwt = require("jsonwebtoken")
const catchAsyncError = require("../errors/catchAsync")
require("dotenv").config()


module.exports.authenticate = catchAsyncError(async(req,res,next) =>{


    const sendUnauthenticated = async() =>{
        return res.status(401).json({message:"unauthenticated"})
    }
    try {
       if(!req.headers.cookie && !req.headers["x-auth-token"]) return sendUnauthenticated()
    const token =  req.headers["x-auth-token"] || extractToken(req.headers.cookie)
    if(!token) return sendUnauthenticated()
    const isAuth = jwt.verify(token,config.secret)
    if(!isAuth.payload) return sendUnauthenticated()
    const user = await User.findById(isAuth.payload)
    if(!user) return sendUnauthenticated()
    req.user = user
    next() 
    } catch (error) {
        sendUnauthenticated()
    }
    
})