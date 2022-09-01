const {authenticate} = require("../middlewares/auth")
const {Router} = require("express")
const router = Router()

router.use(authenticate)

module.exports = router