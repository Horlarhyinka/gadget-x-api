const { Router } = require("express");
const router = Router()
const {getProducts, getProduct, updateOne, deleteProduct, reactToProduct, comment, getComments, reactToComment, createProduct, purchase, getRelatedProducts, getFromJumia, resolvePayment,} = require("../controller/product");
const objectID = require("../middlewares/objectID")
const {authenticate} = require("../middlewares/auth")
const restrictRoute = require("../middlewares/restrict-to-admin")
const catchAsync = require("../errors/catchAsync")

router.post("/", authenticate,catchAsync(restrictRoute),catchAsync(createProduct))
router.get("/",catchAsync(getProducts))
router.get("/jumia",catchAsync(getFromJumia))
router.use(objectID)
router.get("/:id",catchAsync(getProduct))
router.get("/:id/related",catchAsync(getRelatedProducts))

router.use(authenticate) //authenticated routes below
router.patch("/:id/react",catchAsync(reactToProduct))
router.put("/:id",catchAsync(restrictRoute),catchAsync(updateOne))
router.delete("/:id",catchAsync(restrictRoute),catchAsync(deleteProduct))
router.post("/:id/comments",catchAsync(comment))
router.patch("/comments/:id/react",catchAsync(reactToComment))
router.get("/:id/comments",catchAsync(getComments))

module.exports = router;