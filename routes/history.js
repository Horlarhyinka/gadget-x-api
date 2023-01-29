const {Router} = require("express")
const { getHistory } = require("../controller/product")
const { authenticate } = require("../middlewares/auth")
const router = Router()

router.use(authenticate)
router.get("/",getHistory)

module.exports = router