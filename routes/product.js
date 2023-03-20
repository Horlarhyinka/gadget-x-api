const { Router } = require("express");
const router = Router()
const {getProducts, getProduct, updateOne, deleteProduct, reactToProduct, comment, getComments, reactToComment, createProduct, purchase, getRelatedProducts, getFromJumia, resolvePayment,} = require("../controller/product");
const objectID = require("../middlewares/objectID")
const {authenticate} = require("../middlewares/auth")
const restrictRoute = require("../middlewares/restrict-to-admin")
const catchAsync = require("../errors/catchAsync")

router.post("/",catchAsync(authenticate),catchAsync(restrictRoute),catchAsync(createProduct))
router.get("/",catchAsync(getProducts))
router.get("/jumia",catchAsync(getFromJumia))
router.use(catchAsync(objectID))
router.get("/:id",catchAsync(getProduct))
router.get("/:id/related",catchAsync(getRelatedProducts))
router.patch("/:id/react",catchAsync(reactToProduct))

router.use(catchAsync(authenticate)) //authenticated routes below
router.put("/:id",catchAsync(restrictRoute),catchAsync(updateOne))
router.delete("/:id",catchAsync(restrictRoute),catchAsync(deleteProduct))
router.post("/:id/comment",catchAsync(comment))
router.get("/comments/:id/react",catchAsync(reactToComment))
router.get("/comments/:id",catchAsync(getComments))

module.exports = router;