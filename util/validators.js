const objectId = require("joi-objectid")
const joi = require("joi")
const jwt = require("jsonwebtoken")
const mongoose= require("mongoose")
const categories = require("./categories")

module.exports.validateUser = (input) =>{
   return joi.object({
        email: joi.string().required().pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
        password: joi.string().required().min(6)
    }).validate(input)
}

module.exports.validateAdmin = (input) =>{
    return joi.object({
        email: joi.string().required().pattern(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
        firstName:joi.string().required().min(3),
        lastName:joi.string().required().min(3),
    }).validate(input)
}

module.exports.validateProduct = (input) =>{
    if(!categories.includes(input.category)) return {error:{details:{message: `category can only be ${categories}`}}};
    return joi.object({
        name: joi.string().required().trim(),
        category:joi.string().required(),
        price: joi.number().required(),
        preview_image_url: joi.string().required(),
        more_images_url: joi.array().min(1),
        description: joi.string().max(255).min(3),
        quantity: joi.number().min(1)
    }).validate(input)
}


module.exports.validateId = (input) =>{
    return mongoose.Types.ObjectId.isValid(input)
}

module.exports.validateReaction = (reaction)=>{
    reaction = reaction?.toLowerCase()
    const valid = ["like","dislike","haha","angry"]
    return valid.includes(reaction)
}