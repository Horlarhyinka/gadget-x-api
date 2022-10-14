const {Router} = require("express")
const router = Router()
const {adminRegister,adminlogin,login,register,logout,passportRedirect} = require("../controller/auth")
const {usePassport,usePassportAuth} = require("../auth/passport")
const {authenticate} = require("../middlewares/auth")

router.post("/admin/register",adminRegister)
router.post("/admin/login",adminlogin)
router.post("/login",login)
router.post("/register",register)
router.get("/google",usePassport)
router.get("/redirect",usePassportAuth,passportRedirect)
router.get("/logout",authenticate,logout)


module.exports = router
