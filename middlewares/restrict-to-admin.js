module.exports = (req,res,next) =>{
    if(req.user?._kind === "admin")return next();
    return res.status(403).json({message:"sorry, you are not cleared for this action"})
}