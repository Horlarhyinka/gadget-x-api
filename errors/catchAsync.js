const log = require("../logger")

const catchAsync = (fn) =>{
    return async(req,res,next)=>{
        try{
            return await fn(req, res, next)
        }catch(err){
            console.log(err.message)
            if(err.message?.toLowerCase().includes("validation")){
                const errMessages = Object.keys(err.errors).map(field=>err.errors[field].properties?.message)
                return res.status(400).json({message: errMessages.join("\n")})
            }
            return res.status(500).json({message: "internal server error"})
        }
    }
}

module.exports = catchAsync