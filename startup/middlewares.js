require("dotenv").config()
const express = require("express")
const {passport} = require("../auth/passport")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const cors = require("cors")

module.exports = (app) =>{
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(require("cookie-parser")())
app.use(cors({
    origin:["http://localhost:8080", process.env.APP_API_URL, "https://views-danijufarouq2003-gmailcom.vercel.app"],
    credentials: true,
    optionSuccessStatus:200
    }))
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({
        mongoUrl:process.env.DB_URL
    })
}))
app.use(passport.initialize())
app.use(passport.session())
}