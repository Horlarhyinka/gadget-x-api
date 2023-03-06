require("dotenv").config()
const nodemailer = require("nodemailer")
const ejs = require("ejs")
const path = require("path")

const sendMail = async(reciever,type,options) =>{
    options = {duration:process.env.DURATION,...options,email:reciever}
file = await ejs.renderFile(path.resolve(__dirname,`../views/containers/${type}.ejs`),options)

    const mailOptions = {
        from:process.env.MAIL_ADDRESS,
        to:reciever,
        html:file
    }
    try{
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure:true,
        service:"gmail",
        auth: {
            user:process.env.MAIL_ADDRESS,
            pass:process.env.MAIL_PASSWORD
        }
    })

    transporter.verify((err,res)=>{
        if(err){
            throw Error("error with mail transport", err)
        }
    })

    return transporter.sendMail( mailOptions )
    }catch(err){
        throw Error(err)
    }
}

exports.sendNewsLetter = (mails,options) => Promise.all(mails.map(async({email})=>{
    await sendMail(email, "news-letter", options)}))


module.exports = {sendMail}