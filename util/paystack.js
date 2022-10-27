require("dotenv").config()
const axios = require("axios")
const _ = require("lodash")


    
    const initEndPoint = `${process.env.PAYSTACK_BASE_URL}initialize`
    const initializeOptions = {
        method:"POST",
        url:initEndPoint,
        headers:{
            authorization:"Bearer "+ process.env.PAYSTACK_TEST_SECRET,
            "content-type":"Application/json",
            "cache-control":"no-cache"
        },
       
    }

        exports.initialize = (info) =>{
            info.price *= 100
            initializeOptions.data = {email:info.email,amount:parseInt(info.price),metadata:info.metadata}
            return axios(initializeOptions)
        }
        exports.verify = (ref) =>{
            const url = `${process.env.PAYSTACK_BASE_URL}verify/${encodeURIComponent(ref)}`
            const verifyOptions = {...initializeOptions,method:"GET",url}
            return axios(verifyOptions)
        }