const Request = require("supertest")
const {User} = require("../../models/user")
const Admin = require("../../models/admin")
const {Product} = require("../../models/product")
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
    cookie = `authenticate=${await user.genToken(user._id)}`
    console.log({cookie})
    const res = await execute()
    console.log({res})
expect(res.status).toEqual(200)
})

})

describe("restrict route to admin",()=>{
    let admin
    let product
    beforeEach(async()=>{
        Server = require("../../server")
        admin = await Admin.create({firstName:"test",lastName:"test",email:"myadmin@gmail.com",password:"testaroo"})
        product = await Product.create({name:"test",category:"Others",price:1,preview_image_url:"test.jpg",more_images_url:"test.jpg"})
        })
    afterEach(async()=>{
        await Server.close()
        await Admin.findByIdAndDelete(admin._id)
        await Product.findByIdAndDelete(product._id)
    })
    let url = "/api/v1/products/"
    
    it("should respond with status 403 if user._kind is not equal to admin",async()=>{

        admin = await User.create({email:"testing@gmail.com",password:"testaroo"})
        const res = await Request(Server)
                            .put(url+product._id)
                            .set("cookie",`authenticate=${await admin.genToken(admin._id)}`)
                            
        expect(res.status).toEqual(403)
    })
    it("should respond with status 200 if user._kind is equal to admin",async()=>{
        const res = await Request(Server)
                            .put(url+product._id)
                            .send({price:400})
                            .set("cookie",`authenticate=${await admin.genToken(admin._id)}`)
        expect(res.status).toEqual(200)
    })
})