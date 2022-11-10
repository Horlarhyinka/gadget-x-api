const objectId = require("joi-objectid")
const joi = require("joi")
const jwt = require("jsonwebtoken")
const { default: mongoose } = require("mongoose")
joi.objectId = objectId(joi)

module.exports.validateUser = (input) =>{
   return joi.object({
        username: joi.string().min(3),
        email: joi.string().required().pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
        password: joi.string().required().min(6)
    }).validate(input)
}

module.exports.validateProduct = (input) =>{
    const categories = ["Phones and Tablets","Laptops and MacBooks","Watches","Headphones","Power Banks","Others"]
    if(!categories.includes(input.category)) return {error:{details:`category can only be ${categories}`}};
    return joi.object({
        name: joi.string().required().trim(),
        category:joi.string().required(),
        price: joi.number().required(),
        preview_image_url: joi.string().required(),
        more_images_url: joi.array().min(1),
        moreInfo:joi.object(),
        quantity: joi.number().min(1)
    }).validate(input)
}


module.exports.validateId = (input) =>{
    return mongoose.Types.ObjectId.isValid(input)
}

module.exports.verifyJwt = async(token,res) =>{
    try{
        const verified = await jwt.verify(token,process.env.SECRET)
        return verified
    }catch(err){
        return res.status(401).json({message:"unauthenticated"})
    }
}

module.exports.isPresent = (val,array) =>{
    return array.filter(elem =>{
        return elem == val
    }).length
}

module.exports.idIsPresent = (id,array) =>{
    return array.filter(({_id}) =>{
        return _id == id
    }).length
}

module.exports.validateReaction = (reaction)=>{
    const valid = ["like","dislike","haha","angry"]
    return valid.includes(reaction)
}