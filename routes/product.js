const { Router } = require("express");
const router = Router()
const {getProducts, getProduct, updateOne, deleteProduct, reactToProduct, comment, getComments, reactToComment, createProduct, purchase,} = require("../controller/product");
// const {authenticate} = require("../middlewares/auth")
router.use(require("../middlewares/objectID"))
router.post("/",createProduct)
router.get("/",getProducts)
router.get("/:id",getProduct)
// router.use(authenticate)
router.put("/:id",updateOne)
router.delete("/:id",deleteProduct)
router.get("/react/:id",reactToProduct)
router.post("/comment/:id",comment)
router.get("/comments/react/:id",reactToComment)
router.get("/comments/:id",getComments)
router.post("/payment/pay",purchase)

module.exports = router;