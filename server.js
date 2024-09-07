require("express-async-errors")
require("./config/errors")()

const config = require("./config/config")
const express = require("express")
const app = express()
const http =  require("http")
let Server
const PORT = config.port  
const log = require("./logger")
const {connectDB} = require("./config/db")
const mongoose = require("mongoose")

require("./startup/middlewares")(app)
require("./startup/routes")(app)

async function start(){
    try{  Server = http.createServer(app).listen(PORT,()=>{
        log("info",`connected to port ${PORT}`)
    }) 
      connectDB(config.dbUrl).then(()=>{
        log("info","connected to db")
      }).catch((err)=>{
        log("error","could not connect to db"+err)})
    }catch(err){
       log("error","could not start server")
    }
}

start()

module.exports = Server