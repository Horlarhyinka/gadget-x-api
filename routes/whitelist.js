const { Router } = require("express");
const router = Router()
const {authenticate} = require("../middlewares/auth")
const {whitelist,removeFromWhitelist,getWhitelists} = require("../controller/product")
const catchAsync = require("../errors/catchAsync")

router.use(catchAsync(authenticate))
router.use(catchAsync(require("../middlewares/objectID")))
router.post("/:id",catchAsync(whitelist))
router.delete("/:id",catchAsync(removeFromWhitelist))
router.get("/",catchAsync(getWhitelists))

module.exports = router