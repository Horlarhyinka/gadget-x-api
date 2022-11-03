require("dotenv").config()
const log = require("../logger")

const {createClient} = require("redis")
const client = createClient()

client.connect().then(()=>{
    log("info","connected to redis server")
}).catch(err=>{
    log("error","error conecting to redis"+err)
})

module.exports.getOrSetCache = async(key,callback)=>{
    const cached = await client.get(key)
    if(cached) return cached;
    const data = await callback()
    await client.setEx(key,process.env.CACHE_TIME,String(data))
    return data;
}
