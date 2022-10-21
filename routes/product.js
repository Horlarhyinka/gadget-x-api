const { Router } = require("express");
const router = Router()
const {getProducts, getProduct, updateOne, deleteProduct, reactToProduct, comment, getComments, reactToComment, createProduct, purchase, getRelatedProducts, getFromJumia, resolvePayment,} = require("../controller/product");
const objectID = require("../middlewares/objectID")
const {authenticate} = require("../middlewares/auth")
// const {authenticate} = require("../middlewares/auth")
router.use(require("../middlewares/objectID"))
router.post("/",createProduct)
router.get("/",getProducts)
router.get("/jumia",getFromJumia)
router.use(objectID)
router.get("/:id",getProduct)
router.use(authenticate)

router.put("/:id",updateOne)
router.delete("/:id",deleteProduct)
router.get("/:id/related",getRelatedProducts)
router.get("/react/:id",reactToProduct)
router.post("/:id/comment",comment)
router.get("/comments/:id/react",reactToComment)
router.get("/comments/:id",getComments)
router.post("/payment/pay",purchase)
router.get("/payment/success",resolvePayment)
router.get("/payment/failed",(req,res)=>res.send("failed"))

module.exports = router;