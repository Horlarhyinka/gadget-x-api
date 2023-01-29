module.exports.catchAsync = (req,res,next)=>{
try {
    return (childFunction)=>childFunction(req,res)
} catch (error) {
    next()
}
}