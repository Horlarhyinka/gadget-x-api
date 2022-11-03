require("dotenv").config()
const nodemailer = require("nodemailer")
const ejs = require("ejs")
const fs = require("fs")
const path = require("path")

const filePath = path.resolve(__dirname,"../views/containers/reminder.ejs")

exports.sendMail = async(reciever) =>{

    const mailOptions = {
        from:process.env.MAIL_ADDRESS,
        to:reciever,
        subject:"hello",
        text:"hello",
        html:"<p>hello</p>"
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