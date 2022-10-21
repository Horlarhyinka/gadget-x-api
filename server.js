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
app.get("/test",async(req,res)=>{
let arr = []
    const a = await axios.get(uri)
//    console.log({a})
    const $ = cheerio.load(a.data)
    // console.log({$:$.text()})
    let jsPath = "#jm > main > div.aim.row.-pbm > div.-pvs.col12 > section > div.-paxs.row._no-g._4cl-3cm-shs"
    $(jsPath).each((i,el)=>{
arr.push($(el).text())
console.log($(el).contents())
    })
    let data = arr[0].split(/add[\s?]to[\s/]cart/i)
    res.send(data)

})

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