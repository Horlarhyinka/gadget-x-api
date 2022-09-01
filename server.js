require("express-async-errors")
require("./startup/errors")()
require("dotenv").config()
const express = require("express")
const app = express()
const PORT = 2003;
const log = require("./logger")

require("./startup/middlewares")(app)
require("./startup/routes")(app)

function start(){
    try{  const server = app.listen(PORT,()=>{
        log("info",`connected to port ${PORT}`)
    }) 
       const {connectDB} = require("./config/db")
       connectDB(process.env.DB_URL)
    }catch(err){
       log("error","could not start server")
    }
}

start()