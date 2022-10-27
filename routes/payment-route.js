const {Router} = require("express")
const router = Router()
const {makePayment, verifyPayment} = require("../controller/payments")

router.post("/pay/:id",makePayment)
router.get("/success",verifyPayment)

module.exports = router