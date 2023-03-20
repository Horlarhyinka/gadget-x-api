const log = require("../logger")

const catchAsync = (fn) =>{
    return async(req,res,next)=>{
        try{
            return await fn(req, res, next)
        }catch(err){
            log("error", JSON.stringify(ex))
            next()
        }
    }
}

module.exports = catchAsync