const validator = require("../../../util/validators")

describe("validate product",()=>{
    let product = {
        name:"a",
        price:1,
        category:"Others",
        preview_image_url:"a.jpg",
    }
    for(key of Object.keys(product)){
        let testObj 
            testObj = {...product}
            testObj[key] = undefined
 it(`should return an error object if ${key} is undefined`,()=>{ 
            const respond = validator.validateProduct(testObj)
            expect(respond.error).toBeDefined()
        })
    }
it("should return true if all required info are passd",()=>{
    const res = validator.validateProduct({...product})
    expect(res).toBeTruthy()
})
})