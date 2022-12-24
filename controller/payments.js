const paystack = require("../util/paystack")
const _ = require("lodash")
const { Product } = require("../models/product")
const { StatusCodes } = require("http-status-codes")
const order = require("../models/order")
const Admin = require("../models/admin")
const Mailer = require("../util/email")

exports.makePayment = async(req,res)=>{
    const { items } = req.body;
    const email = req.user.email
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
    const response = await paystack.initialize({email,price:parseInt(totalPrice),metadata:{items:itemsList}})
    if(!response) return res.status(500).json({message:"could not make payment"}) 
    console.log(response.data.data["authorization_url"])
    return res.redirect(response.data.data["authorization_url"])
}

exports.verifyPayment = async(req,res) =>{
    const {reference} = req.query;
    if(!reference)return res.status(StatusCodes.FAILED_DEPENDENCY).json({message:"error verifying your payment"})
    const status = await paystack.verify(reference)
    if(!status.data.status) return res.status(500).json({message:"couldn't process payment"});
    const {reference:ref, metadata} = status.data.data;
    const email  = status.data.data.customer.email
    const {items} = metadata;
    await Promise.all(items.map(async({id,quantity})=>{
        await Product.updateOne({_id:id},{$inc:{quantity:parseInt(quantity)*-1}})
    }))
    //get handler

    const availableHandler = await Admin.getAvailableHandler()
    const handler = await Admin.findById(availableHandler)
    
    //if quantity in stock is less than quantity purchased
    //alert handler
    const newOrder = await order.create({reference:ref,email,items:metadata.items,handler})
    //send order confirmation mail
    await Mailer.sendMail(email,"order-reminder",{
        items:newOrder.items,
        handler:newOrder.handler
    })
    //send contract mail t handler
    await Mailer.sendMail(email,"new-contract",{
       items:newOrder.items,
       handler:newOrder.handler
    })
    if(!newOrder) return res.status(500).json({message:"error getting your order, checkback later"})
    return res.status(200).json(newOrder)
}

exports.rejectPayment = async(req,res) =>{
    return res.status(StatusCodes.FAILED_DEPENDENCY).json({message:"error, could not make payment"})
}