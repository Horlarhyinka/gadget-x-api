require("express-async-errors")
require("./startup/errors")()
require("dotenv").config()
const express = require("express")
const app = express()
const http =  require("http")
let Server
const PORT = 2003;
const log = require("./logger")
const {getCache,setCache, getOrSetCache} = require("./util/cache")
const { Product} = require("./models/product")
require("./startup/middlewares")(app)

app.get("/test/:id",async(req,res)=>{
const getData = () => Product.findById(req.params.id)
const data = await getOrSetCache(req.url,getData)
if(!data) return res.status(500).json({message:"error getting data"})
return res.status(200).json(data)
})
require("./startup/routes")(app)

async function start(){
    try{  Server = http.createServer(app).listen(PORT,()=>{
        log("info",`connected to port ${PORT}`)
    }) 
       const {connectDB} = require("./config/db")

       connectDB(process.env.NODE_ENV !== "production"?process.env.DB_URL:process.env.PRODUCTION_DB_URI)
    }catch(err){
       log("error","could not start server")
    }
}

start()

module.exports = Server