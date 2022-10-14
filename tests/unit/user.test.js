const User = require("../../models/user")
const mongoose = require("mongoose")

describe("user",()=>{
    it("should generate jwt",async()=>{
        User.genToken = jest.fn()
        const _id  = mongoose.Types.ObjectId
        await User.genToken(_id)
        expect(User.genToken).toHaveBeenCalled()
    })
})