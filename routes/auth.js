const {Router} = require("express")
const router = Router()
const {adminRegister,adminlogin,login,register,logout,passportRedirect, forgetPassword, forgetPasswordCallback, resetPassword} = require("../controller/auth")
const {usePassport,usePassportAuth} = require("../auth/passport")
const {authenticate} = require("../middlewares/auth")
const catchAsync = require("../errors/catchAsync")

router.post("/admin/register",catchAsync(adminRegister))
router.post("/admin/login",catchAsync(adminlogin))
router.post("/login",catchAsync(login))
router.post("/register",catchAsync(register))
router.get("/google",catchAsync(usePassport))
router.get("/redirect",usePassportAuth,catchAsync(passportRedirect))
router.get("/logout",authenticate,logout)
router.post("/forget-password",catchAsync(forgetPassword))
router.get("/forget-password/:token", catchAsync(forgetPasswordCallback))
router.patch("/forget-password/:token", catchAsync(resetPassword))

module.exports = router
