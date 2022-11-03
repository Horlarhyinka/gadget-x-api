const mongoose = require("mongoose")
const {User} = require("./user")
const adminSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"full name is required"]
    },
    lastName:{
        type:String,
        required:[true,"full name is required"]
    },
    activeHandling:{
        type:Number,
        default:0
    }
})

adminSchema.statics.getAvailableHandler = async function(){
    const admins = await this.find()
    let best = admins[0]
    for(let admin of admins){
        if(admin.activeHandling === 0) return admin._id;
        if(admin.activeHandling > best.activeHandling){
            best = admin
        }
    }
    return best?._id
}

const admin= User.discriminator("admin",adminSchema)

module.exports = admin