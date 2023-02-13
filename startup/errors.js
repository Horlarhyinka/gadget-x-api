const log = require("../logger")

module.exports = () =>{
    process.on("uncaughtException",(ex)=>{
        log("error",ex)
    })
    process.on("unhandledRejection",(ex)=>{
        log("error",ex)
    })
    process.on("deprecation",(ex)=>{
        log("warning",ex)
    })
}

