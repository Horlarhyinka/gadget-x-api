const { validateId } = require("../util/validators")

module.exports = (req,res,next) =>{
const {id } = req.params
if(id){
    if(!validateId(id)) return res.status(400).json({message:"invalid id"})
    next()
}
next()
}