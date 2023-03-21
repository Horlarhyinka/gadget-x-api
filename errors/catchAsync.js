const log = require("../logger")

const catchAsync = (fn) =>{
    return async(req,res,next)=>{
        try{
            return await fn(req, res, next)
        }catch(err){
            console.log(err)
            log("error", JSON.stringify(err))
            next()
        }
    }
}

module.exports = catchAsync