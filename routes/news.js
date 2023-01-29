const {Router} = require("express");
const { subscribe } = require("../controller/news");
const router = Router()

router.post("/",subscribe)

module.exports = router