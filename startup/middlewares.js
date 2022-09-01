const express = require("express")
const {passport} = require("../auth/passport")
const session = require("express-session")

module.exports = (app) =>{
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(require("cookie-parser")())
app.use(require("cors")())
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
}