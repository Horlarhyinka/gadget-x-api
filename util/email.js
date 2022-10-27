require("dotenv").config()
const nodemailer = require("nodemailer")

let options;
if(process.env.NODE_ENV === "production"){

}else{
  options = {
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user:"danijufarouq2003@gmail.com",
        pass:"farouq123.daniju"
    }
} 
}

module.exports = sendMail = async(reciever) =>{

    const mailOptions = {
        //from:"md.horlarh2003@gmail.com",
        from:"danijufarouq2003@gmail.com",
        to:reciever,
        subject:"hello",
        text:"hello",
        html:"<p>hello</p>"
    }

    const testAcc = nodemailer.createTestAccount()
    const transporter = nodemailer.createTransport({
        host: 'smtp.mailtrap.io',
        port: 465,
        secure:true,
        auth: {
            // user: process.env.TEST_MAIL_USER,
            // pass: process.env.TEST_MAIL_PASSWORD
            user:(await testAcc).user,
            pass:testAcc.pass
        }
    });
    const res = await transporter.sendMail(mailOptions)
    console.log(res)

}