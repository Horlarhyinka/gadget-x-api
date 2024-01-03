require("dotenv").config()
const log = require("../logger")
const REDISPASSWORD = process.env.REDISPASSWORD
const REDISHOST = process.env.REDISHOST
const REDISPORT = process.env.REDISPORT

const {createClient} = require("redis")
const options = process.env.NODE_ENV !== "production"?{}:{
    password: REDISPASSWORD,
    socket: {
    host: REDISHOST,
    port: REDISPORT  ,
    reconnectStrategy: retries => Math.min(retries * 50, 1000)
    },  
}
 let client;
 if(process.env.NODE_ENV === "production"){
    client = createClient(options)
 }else{
    client = createClient()
 }
    
client.connect().then(()=>{
    log("info","connected to redis server")
}).catch(err=>{
    log("error","error conecting to redis"+err)
})

module.exports.getOrSetCache = async(key,callback)=>{
    try{
        const cached = await client.get(key);
        if(cached) return JSON.parse(cached);
        const data = await callback()
    try{
        await client.setEx(key,process.env.CACHE_TIME || 2 * 60 * 60 * 1000,JSON.stringify(data))
    }catch(ex){
        return data
    }
    return data;
    }catch(ex){
        throw ex
    }
}
