const {readCookie} = require("../../../util/readcookie")

describe("readcookie",()=>{
    it("should be undefined if invalid data is passed",()=>{
        const result = readCookie("my-cookie","my-cookie-value")
        expect(result).not.toBeDefined()
    })
    it("should return 'my-cookie-value' if valid data is passed",()=>{
        const result = readCookie("my-cookie=my-cookie-value","my-cookie")
        expect(result).toContain("my-cookie-value")
    })
})