const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes.js");


const app = express();

//port variable
const port = Number(process.env.PORT) || 5000;
//configuring enviroment variable
dotenv.config();
//setting up middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(router);






//listening to port
app.listen(port,()=>{
    console.log("now listening to port " + port)
});

