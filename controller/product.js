require("dotenv").config()
const {Product, Comment} = require("../models/product");
const joi = require("joi");
const objectId = require("joi-objectid")
const { validateProduct, validateId, idIsPresent, isPresent, validateReaction } = require("../util/validators");
const _ = require("lodash");
const { User } = require("../models/user");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

module.exports.getProducts = async(req,res)=>{  
    const {count,page} = req.query;
    if(count && page) return res.status(200).json(await Product.find().skip((page - 1) * count).limit(count))
     return res.status(200).json(await Product.find())
}
module.exports.createProduct = async(req,res) =>{
    const validate = validateProduct(req.body)
    
    if(validate.error) return res.status(400).json({message:validate.error.details})

    const product = await Product.create(req.body)
    if(!product) return res.status(500).json({message:"could not create product,try later"})
    return res.status(200).json(product)
}
module.exports.getProduct = async(req,res)=>{
    const validate = validateId(req.params)
    if(validate.error) return res.status(400).json({message:"sorry, invalid id"})
    const {id } = req.params
    const product = await Product.findById(id)
    return res.status(200).json(_.pick(product,["_id","category","name","about","price"]))
}

module.exports.deleteProduct = async(req,res)=>{
    const products = await Product.find().select("_id")
    
    if(!idIsPresent(req.params.id,products)) return res.status(400).json({message:"sorry,this product does not exist"})
    return res.status(200).json(await Product.findByIdAndRemove(req.params.id))
}

module.exports.updateOne = async(req,res) =>{
    const validate = validateId(req.params)
    if(validate.error) return res.status(400).json({message:"sorry, invalid id"})
    let product = await Product.findById(req.params.id)
    const updates = req.body
    for(update in updates){
        if(updates[update] && updates[update] !== product[update]){
            product[update] = updates[update]
        }
    }
    product = await product.save()
    return res.status(200).json(product)
}

module.exports.reactToProduct = async(req,res) =>{
    const reaction = req.query.reaction
    const id = req.params.id
    if(!validateReaction(reaction))return res.status(400).json({message:"invalid entry"})
    if(!id) return res.status(400).json({message:"please select a product"})
    if(!reaction) return res.status(400).json({message:"please select a reaction to react"})
    const product = await Product.findById(id)
    if(!product)return res.status(400).json({message:"sorry, this product does not exist"})
    if(!product.reactions[reaction]){product.reactions[reaction] = 1}
    product.reactions[reaction] += 1
    return res.status(200).json(await product.save())
} 
module.exports.comment = async(req,res) =>{
    const {id} = req.params
    const {comment} = req.body
    if(!id) return res.status(400).json({message:"please select a product to comment"})
    if(!comment) return res.status(400).json({message:"please provide comment body"})
    const newComment = await Comment.create({
        user:_.pick(req.user,["username","email","picture","_id"]),
        comment
    }) 
    if(!newComment) return res.status(500).json({message:"internal server error, try later"})
    const product = await Product.findById(id)
    if(!product)return res.status(400).json({message:"sorry, this product does not exist"})
    product.comments.push(newComment)
    return res.status(200).json(_.pick(await product.save(),["comments"]))
}

module.exports.reactToComment = async(req,res) =>{
    const reaction = req.query.reaction
    const commentID = req.params.id
    if(!commentID) return res.status(400).json({message:"please select a comment"})
    if(!reaction) return res.status(400).json({message:"please select a reaction to react"})
    if(!validateReaction(reaction)) return res.status(400).json({message:"invalid entry"})
    const comment = await Comment.findById(commentID)
    if(!comment)return res.status(400).json({message:"sorry, this comment does not exist"})
    if(!comment.reactions[reaction]){comment.reactions[reaction] = 1}
    comment.reactions[reaction] += 1
    return res.status(200).json(await comment.save())
}

module.exports.getComments = async(req,res) =>{
    const {id} = req.params
    if(!id) return res.status(400).json({message:"please select a product"})
    const {comments} = await Product.findById(id).select("comments").populate("comments")
    return res.status(200).json(comments)

}

module.exports.whitelist = async(req,res) =>{
    const {id} = req.params
    if(!id) return res.status(400).json({message:"please select a product to whitelist"})
    const product = await User.findById(req.user._id)
    if(!product)return res.status(400).json({message:"sorry, this product does not exist"})
    if(isPresent(id,product.whitelist)) return res.status(400).json({message:"product already in whitelist"})
    product.whitelist.push(id)
    return res.status(200).json(_.pick(await product.save(),["whitelist"]))
}
module.exports.removeFromWhitelist = async(req,res) =>{
    const {id} = req.params
    if(!id) return res.status(400).json({message:"please select a product to remove"})
    const updated = await User.findByIdAndUpdate(req.user._id,{$pull:{whitelist:id}},{new:true})
    if(!updated) return res.status(500).json({message:"failed to remove, try again later"})
    return res.status(200).json(_.pick(updated,["whitelist"]))
}
module.exports.getWhitelists = async (req,res) =>{
    return res.status(200).json(await User.findOne(req.user).populate("product").select("whitelist"))
}

module.exports.addToCart = async(req,res) =>{
    const {id} = req.params
    if(!id) return res.status(400).json({message:"please select a product to whitelist"})
    const cart = await User.findByIdAndUpdate(req.user._id,{$push:{cart:id}},{new:true})
    if(!cart)return res.status(500).json({message:"could not whitelist product,try later"})
    return res.status(200).json(_.pick(cart,["cart"]))
}

module.exports.removeFromCart = async(req,res) =>{
    const {id} = req.params
    if(!id) return res.status(400).json({message:"please select a product to remove"})
    const updated = await User.findByIdAndUpdate(req.user._id,{$pull:{cart:id}},{new:true})
    if(!updated) return res.status(500).json({message:"failed to remove, try again later"})
    return res.status(200).json(_.pick(updated,["cart"]))
}

module.exports.clearCart = async(req,res) =>{
    const user = await User.findById(req.user._id)
    user.cart = [];
    await user.save()
    return res.status(200).json(user.cart)
}


module.exports.purchase = async(req,res) =>{
    const checkout_info = req.body.items.map(item =>{
        return _.pick(item,["name","price","quantity"])
    })
    //paystack or stripe (undecided) || paypal payment method
    const sessions = await stripe.checkout.sessions.create({
    mode:[],
    line_items:checkout_info,
    success_url:"/payment/success",
    cancel_url:"/payment/failed"
    })
}

//Product.create({name:"testing",category:"Others",preview_image_url:"testing.jpg",price:120}).then((res)=>{console.log(res)})
// object id = 630f76d3f75ce1d01ba7cc51




//get all,get one,whitelist ,remove from whitelist,updateOne, deleteOne,add to cart,remove from cart, clear cart,
