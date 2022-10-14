
module.exports = (app) =>{
app.use("/api/v1/products",require("../routes/product"));
app.use("/api/v1/whitelist",require("../routes/whitelist"))
app.use("/api/v1/cart",require("../routes/cart"))
app.use("/api/v1/auth",require("../routes/auth"))
app.use(require("../errors/not-found"))
}