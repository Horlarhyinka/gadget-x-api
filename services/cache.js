const config = require("../config/config")
const log = require("../logger")

const {createClient} = require("redis")
const options = config.env !== "production"?{}:{
    password: config.redisPassword,
    socket: {
    host: config.redisHost,
    port: config.redisPort ,
    reconnectStrategy: retries => Math.min(retries * 50, 1000)
    },  
}
 let client;
 if(config.env === "production"){
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
        await client.setEx(key,config.cacheTime || 2 * 60 * 60 * 1000,JSON.stringify(data))
    }catch(ex){
        return data
    }
    return data;
    }catch(ex){
        throw ex
    }
}
