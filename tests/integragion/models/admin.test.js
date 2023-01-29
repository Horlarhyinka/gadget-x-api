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
    it("should get admin stats ",async()=>{
        const result = admin.getStat()
        expect(result).toBeDefined()
    })
    const statCases = ["open","closed","pending"]
    for(stat of statCases){
        it(`should increase ${stat} by one`,async()=>{
            const result = await admin.setStat(stat,1)
             expect(result[stat]).toBeDefined()
        })
    }


})