const {Router} = require("express")
const router = Router()
const {makePayment, verifyPayment, rejectPayment} = require("../controller/payments")

router.post("/pay",makePayment)
router.get("/success",verifyPayment)
router.get("/failed",rejectPayment)

module.exports = router