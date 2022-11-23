require("dotenv").config()
const nodemailer = require("nodemailer")
const ejs = require("ejs")
const fs = require("fs")
const path = require("path")

const sendMail = async(reciever,type,options) =>{
    options = {duration:process.env.DURATION,...options,email:reciever}
    console.log({options,reciever})
file = await ejs.renderFile(path.resolve(__dirname,`../views/containers/${type}.ejs`),options)

    const mailOptions = {
        from:process.env.MAIL_ADDRESS,
        to:reciever,
        html:file
    }
    try{
    const transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 465,
        secure:false,
        auth: {
            user: process.env.TEST_MAIL_USER,
            pass: process.env.TEST_MAIL_PASSWORD
        }
    })
    const res = await transporter.sendMail(mailOptions)
    return res;
    }catch(err){
        throw Error(err)
    }
}

// sendMail("md.horlarh2003@gmail.com","order-reminder",
// {email:"testing at tests.co",
// items:[{name:'test-product',price:"test-price"}],handler:{
//     email:"handlermail@test.co",
//     name:"handler test",
//     phone:"test @ 92736729382"
// },
// duration:5
// }).then(()=>{
//     console.log("reminder sent")
// }).catch((err)=>{
//     console.log("error sending mail",err)
// })


module.exports = {sendMail}