const Request = require("supertest")
const {User} = require("../../models/user")
let user
let Server




describe("auth middleware",()=>{
beforeEach(async()=>{
Server = require("../../server")
user = await User.create({email:"mytest@gmail.com",password:"testaroo"})
})
afterEach(async()=>{
    await Server.close()
    await User.findOneAndDelete({email:"mytest@gmail.com"})
})

let cookie= "1";
let url = "/api/v1/cart/"

const execute = async() =>{
return await Request(Server)
        .get(url)
        .set("cookie",cookie)
    }

it("should respond with status code 401 if no token is provided",async()=>{
const res = await execute()
expect(res.status).toEqual(401)
})

it("should respond with status 200 if token is provided",async()=>{
    cookie = `authenticate=${await user.genToken("63107594bf916c3391b72a2d")}`
    const res = await execute()
expect(res.status).toEqual(200)
})

})

describe("restrict route to admin",()=>{
    
    it("should respond with status 403 if user._kind is not equal to admin",async()=>{

    })
})