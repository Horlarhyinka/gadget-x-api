const {Router} = require("express")
const { getHistory } = require("../controller/product")
const { authenticate } = require("../middlewares/auth")
const router = Router()
const catchAsync = require("../errors/catchAsync")

router.use(catchAsync(authenticate))
router.get("/",catchAsync(getHistory))

module.exports = router