require("dotenv").config()
const passport = require("passport");
const Strategy = require("passport-google-oauth20");
const Admin = require("../models/admin")
const _ = require("lodash")

passport.use(new Strategy({
    clientID:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL:`${process.env.BASE_URL}/auth/redirect`
},function(accessToken,refreshToken,profile,done){
    const {id, _json } = profile
    const data = _.pick(_json,["id","email","picture","name"])
    data.password = id
    return done(null,data)
}))
passport.serializeUser(async(user,done)=>{
    const {email,picture,password,name:username} = user
    return done(null,{email,picture,password,username})
})
passport.deserializeUser(async(id,done)=>{
    try{
       const user = await Admin.findOne(id)
    return done(null, user) 
    }catch(err){
        throw new Error(err)
    }
    
})

const usePassport = passport.authenticate("google",{ scope:["profile","email"] } )

const usePassportAuth = passport.authenticate("google")

module.exports = { passport,usePassport,usePassportAuth}