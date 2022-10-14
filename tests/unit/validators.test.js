const validators = require("../../util/validators")

describe("validators",()=>{
    it("should return a true",()=>{
        const result = validators.validateId("630f76d3f75ce1d01ba7cc51")
        expect(result).toBe(true)
    })
    it("should return a false",()=>{
        const result = validators.validateId("testing")
        expect(result).toBe(false)
    })
})