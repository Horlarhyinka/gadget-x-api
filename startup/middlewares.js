require("dotenv").config()
const express = require("express")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const cors = require("cors")
const passport = require("passport")

module.exports = (app) =>{
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(require("cookie-parser")())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.NODE_ENV === "production"?process.env.APP_UI_URL:"http://localhost:8080");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(cors({
    origin: process.env.NODE_ENV === "production"?process.env.APP_UI_URL:"*",
    credentials: true,
    optionSuccessStatus:200
    }))
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    store:MongoStore.create({
        mongoUrl:process.env.DB_URL
    })
}))
app.use(passport.initialize())
app.use(passport.session())
}