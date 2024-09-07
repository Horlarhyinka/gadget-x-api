const config = require("../config/config")
const nodemailer = require("nodemailer")
const ejs = require("ejs")
const path = require("path")

const sendMail = async(reciever,type,options) =>{
    options = {duration: 5*1000,...options,email:reciever}
file = await ejs.renderFile(path.resolve(__dirname,`../views/containers/${type}.ejs`),options)

    const mailOptions = {
        from:config.mailAddress,
        to:reciever,
        html:file
    }
    try{
    const transporter = nodemailer.createTransport({
        host: config.mailHost,
        port: config.mailPort,
        service: config.mailService,
        auth: {
            user: config.mailUser,
            pass:config.mailPassword
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