const { Router }  = require("express");
const { login, register, googleAuth, oathCallback, logout } = require("../controller/user");

const { usePassport, usePassportRedirect } = require("./passport");
const {User} = require("../models/user")
const _ = require("lodash");
const { authenticate } = require("../middlewares/auth");

const auth = Router();

auth.post("/login",login)
auth.post("/register",register)
auth.get("/google",usePassport)
auth.get("/redirect",usePassportRedirect,async (req,res)=>{
    const {email,picture,password,name} = req.user
    const user = await User.findOne({email:email})

    if(!user)return res.status(200).json(_.pick(await User.create({
        email,password,picture,username:name
    }),["username","email","picture",])) 
    const token = user.genToken(user._id)
    res.cookie("authenticate",token,{expires:process.env.AGE * 1000})
    return res.status(200).json(_.pick(user,["username","email","picture"]))
})

auth.get("/logout",authenticate,logout)



module.exports = auth