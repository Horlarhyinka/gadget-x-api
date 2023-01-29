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
        port: 465,
        secure:false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    })

    transporter.verify((err,res)=>{
        if(err){
            console.log("error with transporter >>>>" + err)
            throw Error("error with mail transport", err)
        }else{
            console.log("transporter is good to go >>>"+ res)
        }
    })

    const res = await transporter.sendMail(mailOptions)
    return res;
    }catch(err){
        throw Error(err)
    }
}


module.exports = {sendMail}