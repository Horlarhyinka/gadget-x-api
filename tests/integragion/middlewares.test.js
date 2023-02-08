const Request = require("supertest")
const {User} = require("../../models/user")
const Admin = require("../../models/admin")
const {Product} = require("../../models/product")
let user
let Server


beforeEach(()=>{
Server = require("../../server")
})
afterEach(async()=>{
await Server.close()
Server = undefined
})

describe("auth middleware",()=>{
beforeEach(async()=>{
user = await User.create({email:"mytest@gmail.com",password:"testaroo"})
})

afterEach(async()=>{
    await User.findOneAndDelete({email:"mytest@gmail.com"})

})

let token;
let url = "/api/v1/cart/"

const execute = async() =>{
return Request(Server)
        .get(url)
        .set("x-auth-token",token)
    }

it("should respond with status code 401 if no token is provided",async()=>{
const res = await Request(Server)
                    .get(url)
expect(res.status).toEqual(401)
})

it("should respond with status 200 if token is provided",async()=>{
    token = await user.genToken(user._id)
    const res = await execute()
expect(res.status).toEqual(200)
})

})

describe("restrict route to admin",()=>{
    let admin
    let product
    let token
    beforeEach(async()=>{
        admin = await Admin.create({firstName:"test",lastName:"test",email:"myadmin@gmail.com",password:"testaroo"})
        product = await Product.create({name:"test",category:"Others",price:1,preview_image_url:"test.jpg",more_images_url:"test.jpg"})
        })
    afterEach(async()=>{
        await Admin.findByIdAndDelete(admin._id)
        await Product.findByIdAndDelete(product._id)
    })
    let url = "/api/v1/products/"

    const execute = () =>{
        const update = {name:"test1"}
        return Request(Server)
            .put(url+product._id)
            .set("x-auth-token",token)
            .send(update)
        } 
    it("should respond with status 403 if user._kind is not equal to admin",async()=>{
        admin = await User.create({email:"test@gmail.com",password:"testing"})
        token = await admin.genToken(admin._id)
        const res = await execute()
        expect(res.status).toEqual(403)
                    })
    it("should respond with status 200 if user._kind is equal to admin",async()=>{
        token = await admin.genToken(admin._id)
        const res = await execute()
        expect(res.status).toEqual(200)
    })
}

)