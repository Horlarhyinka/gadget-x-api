const Admin = require("../../../models/admin")
let Server

beforeEach(()=>{
    Server = require("../../../server")
})
afterEach(async()=>{
    await Server.close()
})
describe("admin model",()=>{
    let admin ;
    beforeEach(async()=>{
        admin = await Admin.create({
                        email:"testing01@gmail.com",
                        password:"testaroo",
                        firstName:'test',
                        lastName:"test"
                    })
    })
    afterEach(async()=>{
        await Admin.findByIdAndDelete(admin._id)
    })
    it("should get all available admin",async()=>{
        const result = await Admin.getAvailableHandler()
        expect(result._id).toBeDefined()
    })
})