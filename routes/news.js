const {Router} = require("express");
const { subscribe } = require("../controller/news");
const catchAsync = require("../errors/catchAsync")
const router = Router()

router.post("/",catchAsync(subscribe))

module.exports = router