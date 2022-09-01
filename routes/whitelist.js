const { Router } = require("express");
const router = Router()
const {authenticate} = require("../middlewares/auth")
const {whitelist,removeFromWhitelist,getWhitelists} = require("../controller/product")

router.use(authenticate)
router.use(require("../middlewares/objectID"))
router.get("/whitelist/:id",whitelist)
router.delete("/whitelist/:id",removeFromWhitelist)
router.get("/whitelists",getWhitelists)

module.exports = router