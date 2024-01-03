const log = require("../logger")

module.exports = () =>{
    process.on("uncaughtException",(ex)=>{
        log("error","uncaught exception "+ex)
    })
    process.on("unhandledRejection",(ex)=>{
        log("error","unhandled rejection "+ex)
    })
    process.on("deprecation",(ex)=>{
        console.log(ex)
        log("info",ex)
    })
}

