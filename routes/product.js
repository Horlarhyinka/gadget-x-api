const { Router } = require("express");
const router = Router()
const {getProducts, getProduct, updateOne, deleteProduct, reactToProduct,} = require("../controller/product");
const {authenticate} = require("../middlewares/auth")

router.use(require("../middlewares/objectID"))
router.get("/",getProducts)
router.get("/:id",getProduct)
router.use(authenticate)
router.put("/:id",updateOne)
router.delete("/:id",deleteProduct)
router.get("/react/:id",reactToProduct)
router.post("/comment/:id",)

module.exports = router;