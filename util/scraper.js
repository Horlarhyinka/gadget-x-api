const cheerio = require("cheerio")
const axios = require("axios")


exports.scrape = async(url,jsPath) =>{
    let result = []
    let sorted = []
    const datas = await axios.get(url)
        const $ = cheerio.load(datas.data)
        $(jsPath).each((i,data)=>{
            result.push($(data).text().trim())
        })
        result = result[0].split("Add To Cart")
        result.map(info =>{
            let result = {}
            info = info.split("₦")
            result["preview"] = info[0]
            result["price"] = info[1]
            result["discount"] = info[2]
            sorted.push(result)
        })
        return sorted;
}