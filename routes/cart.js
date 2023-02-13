const { Router } = require("express");
const router = Router()
const{addToCart, removeFromCart, clearCart, getCart} = require("../controller/product")
const {authenticate} = require("../middlewares/auth")
const catchAsync = require("../errors/catchAsync")

router.use(catchAsync(authenticate))
router.use(catchAsync(require("../middlewares/objectID")))
router.get("/",catchAsync(getCart))
router.post("/:id",catchAsync(addToCart))
router.delete("/:id",catchAsync(removeFromCart))
router.delete("/",catchAsync(clearCart))

module.exports = router