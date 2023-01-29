const {Router} = require("express")
const router = Router()
const {makePayment, verifyPayment, rejectPayment} = require("../controller/payments")
const { authenticate } = require("../middlewares/auth")


router.get("/success",verifyPayment)
router.get("/failed",rejectPayment)

router.use(authenticate)

router.post("/pay",makePayment)


module.exports = router