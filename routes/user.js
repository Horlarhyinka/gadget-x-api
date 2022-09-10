const {authenticate} = require("../middlewares/auth")
const {Router} = require("express")
const router = Router()

router.post("/auth/register")

router.use(authenticate)

module.exports = router