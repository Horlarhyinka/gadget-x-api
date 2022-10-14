const mongoose = require("mongoose")
const objectID =  require("../../middlewares/objectID")
const restrictRoute = require("../../middlewares/restrict-to-admin")

describe("objectID",()=>{
    it("should call the next function if valid ID is provided",()=>{
        let mock = jest.fn()
        let req = mock
        let res = mock.mockReturnValue({})
        req.params = mock;

        req.params = mock.mockReturnValue(mongoose.Types.ObjectId)
        let next = mock
        objectID(req,res,next)
        expect(next).toHaveBeenCalled()
    })
    it("should call status if invalid id is provided",()=>{

        let mock = jest.fn()
        let req = mock
        req.params = mock
        req.params = mock.mockReturnValue(1)
        let res = mock
        res.status = mock
        let next = mock
        objectID(req,res,next)
        expect(res.status).toHaveBeenCalled()
    })
})

