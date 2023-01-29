const { Router } = require("express");
const router = Router()
const {getProducts, getProduct, updateOne, deleteProduct, reactToProduct, comment, getComments, reactToComment, createProduct, purchase, getRelatedProducts, getFromJumia, resolvePayment,} = require("../controller/product");
const objectID = require("../middlewares/objectID")
const {authenticate} = require("../middlewares/auth")
const restrictRoute = require("../middlewares/restrict-to-admin")
router.post("/",authenticate,restrictRoute,createProduct)
router.get("/",getProducts)
router.get("/jumia",getFromJumia)
router.use(objectID)
router.get("/:id",getProduct)
router.get("/:id/related",getRelatedProducts)
router.post("/react/:id",reactToProduct)

router.use(authenticate) //authenticated routes below
router.put("/:id",restrictRoute,updateOne)
router.delete("/:id",restrictRoute,deleteProduct)
router.post("/:id/comment",comment)
router.get("/comments/:id/react",reactToComment)
router.get("/comments/:id",getComments)

module.exports = router;