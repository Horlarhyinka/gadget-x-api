const {Router} = require("express")
const router = Router()
const {makePayment, verifyPayment} = require("../controller/payments")
const { authenticate } = require("../middlewares/auth")
const catchAsync = require("../errors/catchAsync")


router.use(catchAsync(authenticate))
router.get("/verify",catchAsync(verifyPayment))
router.post("/pay",catchAsync(makePayment))


module.exports = router