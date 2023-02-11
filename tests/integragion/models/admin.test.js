const Admin = require("../../../models/admin")
const mongoose = require("mongoose")
let Server

beforeEach(()=>{
    Server = require("../../../server")
})
afterEach(async()=>{
    await Server.close()
    Server = undefined
})

    let admin ;

    describe("admin model",()=>{
        beforeEach(async()=>{
            admin = await Admin.create({firstName:"test",lastName:"test",email:"test@test.co",password:"test"})
        })
        afterEach(async()=>{
            await Admin.findByIdAndDelete(admin._id)
        })
        it("admin should be defined",async()=>{
            expect(mongoose.Types.ObjectId.isValid(admin?._id)).toBeTruthy()
        })
        it("should have a _kind property of admin",()=>{
            expect(admin._kind?.toLowerCase()).toEqual("admin")
        })
    })