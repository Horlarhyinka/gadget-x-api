module.exports = (req,res)=>{
    return res.status(404).json({message:"oops,a 404 error (this is because you made an invalid entry)"})
}