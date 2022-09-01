const log = require("../logger")

module.exports = () =>{
    process.on("uncaughtException",(ex)=>{
        console.log(ex)
        log("error",ex)
    })
    process.on("unhandledRejection",(ex)=>{
        console.log(ex)
        log("error",ex)
    })
    process.on("deprecation",(ex)=>{
        log("warning",ex)
    })
}

