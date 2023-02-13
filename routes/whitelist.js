const { Router } = require("express");
const router = Router()
const {authenticate} = require("../middlewares/auth")
const {whitelist,removeFromWhitelist,getWhitelists} = require("../controller/product")
const catchAsync = require("../errors/catchAsync")

router.use(catchAsync(authenticate))
router.use(catchAsync(require("../middlewares/objectID")))
router.get("/whitelist/:id",catchAsync(whitelist))
router.delete("/whitelist/:id",catchAsync(removeFromWhitelist))
router.get("/whitelists",catchAsync(getWhitelists))

module.exports = router