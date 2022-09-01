const { Router } = require("express");
const router = Router()
const{addToCart, removeFromCart, clearCart} = require("../controller/product")
const {authenticate} = require("../middlewares/auth")

router.use(authenticate)
router.use(require("../middlewares/objectID"))
router.get("/:id",addToCart)
router.delete("/:id",removeFromCart)
router.delete("/",clearCart)

module.exports = router