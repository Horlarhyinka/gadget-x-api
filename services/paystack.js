const config = require("../config/config")
const axios = require("axios")
const _ = require("lodash")


    
    const initEndPoint = `${config.paystackBaseUrl}initialize`
    const initializeOptions = {
        method:"POST",
        url:initEndPoint,
        headers:{
            authorization:"Bearer "+ config.paystackSecret,
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
            const url = `${config.paystackBaseUrl}verify/${encodeURIComponent(ref)}`
            const verifyOptions = {...initializeOptions,method:"GET",url}
            return axios(verifyOptions)
        }