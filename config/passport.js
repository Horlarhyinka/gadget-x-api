const passport = require("passport");
const Strategy = require("passport-google-oauth20");
const _ = require("lodash");
const { User } = require("../models/user");
const config = require("./config")

const redirect_url = `${config.baseURL}auth/redirect`

passport.use(new Strategy({
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: redirect_url,
    redirect_url
},async(accessToken,refreshToken,profile,done)=>{
    const {id, _json } = profile 
    const data = {password:id, email: _json.email}
    let user = await User.findOne({email:data.email})
    if(!user){
        user = await User.create({email:data.email, password:data.password})
    }
    return done(null,user)
}))
passport.serializeUser((user,done)=>{
    return done(null,user._id)
})
passport.deserializeUser(async(id,done)=>{
    try{
       const user = await User.findById(id)
    return done(null, user._id) 
    }catch(err){
        throw new Error(err)
    }
})

const usePassport = passport.authenticate("google",{ scope:["profile", "email"] } )

const usePassportAuth = passport.authenticate("google")

module.exports = { usePassport, usePassportAuth}