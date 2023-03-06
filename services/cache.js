require("dotenv").config()
const log = require("../logger")
const REDISUSER = process.env.REDISUSER
const REDISPASSWORD = process.env.REDISPASSWORD
const REDISHOST = process.env.REDISHOST
const REDISPORT = process.env.REDISPORT

const {createClient} = require("redis")
const options = process.env.NODE_ENV !== "production"?{}:{
    url:`redis://${REDISUSER}:${REDISPASSWORD}@${ REDISHOST }:${ REDISPORT }`,
    socket: {
    host: REDISHOST,
    port: REDISPORT  ,
    reconnectStrategy: retries => Math.min(retries * 50, 1000)
    },  
}
 const client = createClient(options)
    
client.connect().then(()=>{
    log("info","connected to redis server")
}).catch(err=>{
    log("error","error conecting to redis"+err)
})

module.exports.getOrSetCache = async(key,callback)=>{
    const cached = await client.get(key);
    if(cached) return JSON.parse(cached);
    const data = await callback()
    await client.setEx(key,process.env.CACHE_TIME,JSON.stringify(data))
    return data;
}
