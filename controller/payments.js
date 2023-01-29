const paystack = require("../util/paystack")
const _ = require("lodash")
const { Product } = require("../models/product")
const { StatusCodes } = require("http-status-codes")
const order = require("../models/order")
const Mailer = require("../util/email")
const { User } = require("../models/user")

exports.makePayment = async(req,res)=>{
    const { items } = req.body;
    const email = req.user.email
    if(!items)return res.status(400).json({message:"select items to purchase"})
    const ids = []
    let itemsList = await Promise.all(items.map(async({quantity,id})=>{
        if(!quantity){
            quantity = 1
        }
        const product = await Product.findById(id)
        if(!product)return res.status(404).json({message:"sorry, product not found"})
        if(!product.isAvailable)return res.status(400).json({message:`the selected quantity of ${product.name} is above the available quantity`})
        ids.push(id)
        return {..._.pick(product,["name","category","price","_id"]),quantity}
    }))

    const totalPrice = itemsList.reduce((sum,{price,quantity})=>sum += price*quantity,0)   
    const response = await paystack.initialize({ email, price:parseInt(totalPrice), metadata:{items:itemsList}, token:req.headers["x-auth-token"]})
    console.log({response})
    if(!response) return res.status(500).json({message:"could not make payment"}) 
    return res.json({data:response.data.data["authorization_url"]})
}

exports.verifyPayment = async(req,res) =>{
    const {reference} = req.query;
    if(!reference)return res.status(StatusCodes.FAILED_DEPENDENCY).json({message:"error verifying your payment"})
    const status = await paystack.verify(reference)
    if(!status.data.status) return res.status(500).json({message:"couldn't verify payment"});
    const {reference:ref, metadata} = status.data.data;
    const email  = status.data.data.customer.email
    const user = await User.findOne({email})
    if(!user) return res.json({message:"user not found"})
    const {items} = metadata;
   
    await Promise.all(items.map(async({_id,quantity})=>{
        await Product.updateOne({_id},{$inc:{quantity:parseInt(quantity)*-1}})
        await User.findByIdAndUpdate(user._id,{$pull:{cart:_id}})
    }))
    const newOrder = await order.create({reference:ref ,email ,items:metadata.items ,status:"successful"})
    await User.findOneAndUpdate({email:user.email},{$push:{
        history:newOrder?._id
    }})
    //send order confirmation mail
    await Mailer.sendMail(email,"order-reminder",{
        items:newOrder.items
    })
    if(!newOrder) return res.status(500).json({message:"error getting your order, checkback later"})
    return res.status(300).redirect(process.env.APP_UI_URL+"/history")
}

exports.rejectPayment = async(req,res) =>{
    return res.status(StatusCodes.FAILED_DEPENDENCY).json({message:"error, could not make payment"})
}