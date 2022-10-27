require("express-async-errors")
require("./startup/errors")()
require("dotenv").config()
const axios = require("axios")
const cheerio = require("cheerio")
const express = require("express")
const app = express()
const PORT = 2003;
const log = require("./logger")

const uri = "https://www.jumia.com.ng/catalog/?q=gadgets"
//require("./util/email")("horlarhyinkaddev@gmail.com")



require("./startup/middlewares")(app)
require("./startup/routes")(app)




function start(){
    try{  const server = app.listen(PORT,()=>{
        log("info",`connected to port ${PORT}`)
    }) 
       const {connectDB} = require("./config/db")
       connectDB(process.env.NODE_ENV !== "production"?process.env.DB_URL:process.env.PRODUCTION_DB_URI)
    }catch(err){
       log("error","could not start server")
    }
}




start()