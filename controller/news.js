const Newsletter = require("../models/news");

module.exports.subscribe = async(req,res)=>{
    const {email} = req.body
    const exists = await Newsletter.findOne({email})
    if(!exists) await Newsletter.create({email})
    return res.status(200).json({message:"successful"})
}