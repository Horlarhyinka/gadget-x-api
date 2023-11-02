require("dotenv").config()
const {Product, Comment} = require("../models/product");
const { validateProduct, idIsPresent, isPresent, validateReaction } = require("../util/validators");
const _ = require("lodash");
const { User } = require("../models/user");
const scraper = require("../util/scraper")
const {getOrSetCache} = require("../services/cache")

module.exports.getProducts = async(req,res)=>{  
    let {category, search} = req.query;
    const page = req.query.page || 1
    const count = req.query.count || 20
    let result = {
        page: 1,
        total: 0,
        data: []
    }
    search = search?.trim().replace(/[\[\]\.\-\(\)]/g, "")
    let searchReqex = new RegExp(`${search}`, "gi");

    if(category?.toLowerCase() === "all"){
        category = undefined
    }
    if(!search || search.toLowerCase() === "all"){
        searchReqex = /./
    }
    if(category){
        category = category.toLowerCase().replace(/^\s&\s$/g, " and ")
        result.data = await Product.find({category})
        .or([{name: {$regex: searchReqex}}, 
        {description: {$regex: searchReqex}}])
        .skip((page - 1) * count)
        .limit(count)
        result.total = await Product.countDocuments({category})
        .or([{name: {$regex: searchReqex}}, 
        {description: {$regex: searchReqex}}])
    }else{
        result.data = await Product
        .find({})
        .or([{name: {$regex: searchReqex}}, 
        {description: {$regex: searchReqex}}])
        .skip((page - 1) * count).limit(count)
        result.total = await Product.countDocuments()
        .or([{name: {$regex: searchReqex}}, 
        {description: {$regex: searchReqex}}])
    }
    return res.status(200).json(result)
}
module.exports.createProduct = async(req,res) =>{
    const productObj = {...req.body, category: req.body.category?.toLowerCase()}
    const validate = validateProduct(productObj)
    if(validate.error) return res.status(400).json({message:validate.error.details.message})
    const product = await Product.create(productObj)
    return res.status(200).json(product)
}
module.exports.getProduct = async(req,res)=>{
    const {id } = req.params
    const product = await Product.findById(id).populate("comments")
    return res.status(200).json(_.pick(product,["_id","category","name","description","quantity","price","preview_image_url","more_images_url","comments","reactions"]))
}

module.exports.deleteProduct = async(req,res)=>{
    const product = await Product.findByIdAndRemove(req.params.id)
    if(!product) return res.status(400).json({message:"sorry,this product does not exist"})
    return res.status(200).json({data:product})
}

module.exports.updateOne = async(req,res) =>{
    let product = await Product.findById(req.params.id)
    const updates = req.body
if(!product)return res.status(404).json({message: "product not found"})
    for(let update of Object.keys(updates)){
        if(updates[update] && updates[update] !== product[update]){
            product[update] = updates[update]
        }
    }
    product = await product.save()
    return res.status(200).json(product)
}

module.exports.reactToProduct = async(req,res) =>{
    const reaction = req.query.reaction?.toLowerCase()
    const id = req.params.id
    if(!validateReaction(reaction))return res.status(400).json({message:"invalid reaction"})
    const reactionGroup = reaction + "s"
    if(!id) return res.status(400).json({message:"please select a product"})
    if(!reaction) return res.status(400).json({message:"please select a reaction to react"})
    const product = await Product.findById(id)
    if(!product)return res.status(400).json({message:"sorry, this product does not exist"})
    if(product.reactions[reactionGroup]?.includes(String(req.user._id))){
        product.reactions[reactionGroup] = product.reactions[reactionGroup].filter(userId =>String(userId) !== String(req.user._id))
    }else{
        product.reactions[reactionGroup].push(String(req.user._id))
    }
    return res.status(200).json(await product.save())
} 

module.exports.comment = async(req,res) =>{
    const {id} = req.params
    const {body} = req.body
    if(!id) return res.status(400).json({message:"please select a product to comment"})
    if(!body) return res.status(400).json({message:"please provide comment body"})
    const product = await Product.findById(id).populate("comments")
    if(!product)return res.status(400).json({message:"sorry, this product does not exist"})
    const newComment = await Comment.create({email:req.user.email, body})
    if(!newComment) return res.status(500).json({message:"failed to post comment, try later"})
    product.comments.push(newComment)
    const {comments} = await product.save()
    return res.status(200).json({data:comments})
    
}

module.exports.reactToComment = async(req,res) =>{
    const reaction = (req.query.reaction || req.body.reaction)?.toLowerCase()
    const commentID = req.params.id
    if(!commentID) return res.status(400).json({message:"commentId is required"})
    if(!reaction) return res.status(400).json({message:"select a reaction to react"})
    if(!validateReaction(reaction)) return res.status(400).json({message:`invalid reaction ${reaction}`})
    const comment = await Comment.findById(commentID)
    if(!comment)return res.status(400).json({message:"comment not found"})
    if(!comment.reactions[reaction].includes(String(req.user._id))){
        comment.reactions[reaction] = comment.reactions[reaction].filter(userId=>userId !== String(req.user._id))
    }else{
        comment.reactions[reaction].push(String(req.user._id))
    }
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
    const product = await Product.findById(id)
    if(!product) return res.status(404).json({message: "product not found"})
    const { whitelist } = await User.findByIdAndUpdate(req.user._id,{$addToSet: {whitelist: id}}, {new: true}).populate("whitelist")
    return res.status(200).json(whitelist)
}

module.exports.removeFromWhitelist = async(req,res) =>{
    const {id} = req.params
    if(!id) return res.status(400).json({message:"please select a product to remove"})
    const updated = await User.findByIdAndUpdate(req.user._id,{$pull:{whitelist:id}},{new:true}).populate("whitelist")
    if(!updated) return res.status(500).json({message:"failed to remove, try again later"})
    return res.status(200).json(_.pick(updated,["whitelist"]))
}

module.exports.getWhitelists = async (req,res) =>{
    return res.status(200).json(await User.findById(req.user._id).populate("whitelist").select("whitelist"))
}

module.exports.addToCart = async(req,res) =>{
    const {id} = req.params
    if(!id) return res.status(400).json({message:"please select a product to whitelist"})
    const cart = await User.findByIdAndUpdate(req.user._id,{$addToSet:{cart:id}},{new:true}).populate("cart")
    if(!cart)return res.status(500).json({message:"add to cart,try later"})
    return res.status(200).json(_.pick(cart,["cart"]))
}

module.exports.getCart = async(req,res)=>{
    return res.status(200).json(_.pick(await User.findById(req.user._id).populate("cart"),["cart"]))
}

module.exports.removeFromCart = async(req,res) =>{
    const {id} = req.params
    if(!id) return res.status(400).json({message:"please select a product to remove"})
    const updated = await User.findByIdAndUpdate(req.user._id,{$pull: {cart: id}},{new: true}).populate("cart")
    if(!updated) return res.status(500).json({message: "failed to remove, try again later"})
    return res.status(200).json(_.pick(updated,["cart"]))
}

module.exports.clearCart = async(req,res) =>{
    let user = await User.findById(req.user._id)
    user.cart = [];
    user = await user.save()
    return res.status(200).json(user.cart)
}

module.exports.getRelatedProducts = async(req,res) =>{
    const {id} = req.params
    const product = await Product.findById(id)
    if(!product) return res.status(404).json({message:"product not found"})
    let products = await Product.find()
    const filtered = products.filter(prod =>{
        return prod.category.includes(product.category) || product.category.includes(prod.category) || (prod.name + prod.description).includes(product.name) || Math.abs(Number(prod.price) - Number(product.abs)) < 1000
    })
    return res.status(200).json(filtered)
}


module.exports.getFromJumia = async(req,res) =>{
    let key = req.query.key || "gadgets"

    let url = "https://www.jumia.com.ng/catalog/"

    if(key){
        key = key.replace(/[\s&\-?]/,"")
        url += `?q=${key}`
    }
    try{
        const data = await getOrSetCache(key,async()=>scraper.scrape(url))
        if(!data) return res.status(404).json({message:"failed to fetch"})
        return res.status(200).json(data)
    }catch(err){
        return res.status(500).json({message:"ffailed to fetch data"})
    }
}

module.exports.getHistory = async(req,res) =>{
    const {history} = await User.findById(req.user._id).populate("history")
    history.sort((a,b)=>a.createdAt-b.createdAt)
    return res.status(200).json({data:history})
}