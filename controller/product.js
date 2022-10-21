require("dotenv").config()
const {Product, Comment} = require("../models/product");
const joi = require("joi");
const objectId = require("joi-objectid")
const { validateProduct, validateId, idIsPresent, isPresent, validateReaction } = require("../util/validators");
const _ = require("lodash");
const { User } = require("../models/user");
const cheerio = require("cheerio");
const axios = require("axios");
const Order = require("../models/order");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

module.exports.getProducts = async(req,res)=>{  
    const {count,page, category} = req.query;
    if(category){
        try{
            if(count && page) return res.status(200).json(await Product.find({category}).skip((page - 1) * count).limit(count))
     return res.status(200).json(await Product.find({category}))
        }catch{
            return res.status(400).json({message:"invalid entry"})
        }

    }
    if(count && page) return res.status(200).json(await Product.find().skip((page - 1) * count).limit(count))
     return res.status(200).json(await Product.find())
}
module.exports.createProduct = async(req,res) =>{
    const validate = validateProduct(req.body)
    if(validate.error) return res.status(400).json({message:validate.error.details})
    const {name,price} = req.body
    try{
    const {id:paymentID} = await stripe.products.create({name})
    const {id: priceID} = await stripe.prices.create({unit_amount:price,
    currency:"USD",product:paymentID})
    const product = await Product.create({...req.body,paymentID,priceID})
    if(!product) return res.status(500).json({message:"could not create product,try later"})

    await product.save()
    return res.status(200).json(product)
    }catch(err){
        return res.status(500).json({message:"internal server error"})
    }

}
module.exports.getProduct = async(req,res)=>{
    const {id } = req.params
    const product = await Product.findById(id).populate("comments")
    return res.status(200).json(_.pick(product,["_id","category","name","moreInfo","price","preview_image_url","more_images_url","comments","reactions"]))
}

module.exports.deleteProduct = async(req,res)=>{
    const products = await Product.find().select("_id")
    if(!idIsPresent(req.params.id,products)) return res.status(400).json({message:"sorry,this product does not exist"})
    return res.status(200).json(await Product.findByIdAndRemove(req.params.id))
}

module.exports.updateOne = async(req,res) =>{
    console.log(req.body)
    const validate = validateId(req.params)
    //console.log(validate)
    if(validate.error) return res.status(400).json({message:"sorry, invalid id"})
    let product = await Product.findById(req.params.id)
    const updates = req.body

    for( update of Object.keys(updates)){
        console.log(update)
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
    const product = await Product.findById(id)
    if(!product)return res.status(400).json({message:"sorry, this product does not exist"})
    const newComment = await Comment.create({
        user:_.pick(req.user,["username","email","picture","_id"]),
        comment
    })
    if(!newComment) return res.status(500).json({message:"internal server error, try later"})
    product.comments.push(newComment)
    return res.status(200).json(_.pick(await product.save(),["comments"]))
}

module.exports.reactToComment = async(req,res) =>{
    const reaction = req.query.reaction || req.body.reaction
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
    const items = await req.body.items.map(async({id,quantity})=>{
        const paymentDetails = await Product.getPaymentDetails(id)
        return{...paymentDetails,quantity}
    })
    
    //paystack or stripe (undecided) || paypal payment method
    const vals = await Promise.all(items)
    console.log({vals})
    const session = await stripe.checkout.sessions.create({
    // methods:["card"],
    mode:"payment",
    line_items:vals,
    success_url:"http://localhost:2003/api/v1/products/payment/success",
    cancel_url:"http://localhost:2003/api/v1/products/payment/failed"
    })
    if(!session) return res.status(500).json({message:"can't process payments at the moment. Please try later"})
    console.log(session.url)
    const newOrder = await Order.create({
        user:req.user._id,
        sessionID:session.id,
        product:req.body.items.map(item=>item.id),
        quantity:req.body.items.reduce((red,item)=>red+=item.quantity,0),
    })

    console.log(newOrder)
    await User.findByIdAndUpdate(req.user._id,{orders:{$push:newOrder}})
    
    return res.redirect(session.url)
}

module.exports.resolvePayment = async(req,res) =>{
    const user = await User.findById(req.user._id).populate("orders")
    Promise.all(user.orders.map(async(order)=>{
        if(order.status === "pending"){
            const session = await stripe.checkout.sessions.retrieve(order.sessionID)
            if(session.status === "successful" || "closed" || "processed"){
                await Order.findByIdAndUpdate(order._id)
            }
        }
    })).then(()=>res.status(200).json({message:"payment successful"}))
    
    
}

module.exports.getRelatedProducts = async(req,res) =>{
    const {id} = req.params
    const product = await Product.findById(id)
    if(!product) return res.status(404).json({message:"product not found"})
    const products = await Product.find({category:product.category})
    console.log({products})
    return res.status(200).json(products.filter(prod=>Math.abs(product.price-prod.price) <= 20 && String(prod._id) !== id))
}


module.exports.getFromJumia = async(req,res) =>{
    let {key,category} = req.query
    const result = []

    let jsPath = "#jm > main > div.aim.row.-pbm > div.-pvs.col12 > section > div.-paxs.row._no-g._4cl-3cm-shs"
    
    let url = "https://www.jumia.com.ng/catalog/"
    if(category){
        category = category.replace(" and ","-")
        url += `${category}/`
    }
    if(key){
        key = key.replace(/[\s&\-?]/,"")
        url += `?q=${key}`
    }
    
    try{
        const datas = await axios.get(url)
        const $ = cheerio.load(datas.data)
        $(jsPath).each((i,data)=>{
            console.log(i)
            result.push($(data).text().trim())
        })
        res.status(200).json(result)


    }catch(err){
        return res.status(500).json({message:"could not get jumia data"})
    }
 

}
//Product.create({name:"testing",category:"Others",preview_image_url:"testing.jpg",price:120}).then((res)=>{console.log(res)})
// object id = 630f76d3f75ce1d01ba7cc51




//get all,get one,whitelist ,remove from whitelist,updateOne, deleteOne,add to cart,remove from cart, clear cart,
