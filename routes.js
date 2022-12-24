const { Router } = require("express");
const router = Router();

router.get("/",(req,res)=>{
    res.send("get request received")
})

module.exports = router;