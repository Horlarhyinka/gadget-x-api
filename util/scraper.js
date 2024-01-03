const cheerio = require("cheerio")
const axios = require("axios")


exports.scrape = async(url) =>{
    try{
    const _path = "#jm > main > div.aim.row.-pbm > div.-pvs.col12 > section > div.-paxs.row._no-g._4cl-3cm-shs"
    const datas = await axios.get(url)
        const $ = cheerio.load(datas.data)
    const list = []
    $(_path).children().each((i,child)=>{
        const img = $(child).find("img.img").attr("data-src")
        const price = $(child).find("div.prc").text()
        const name = $(child).find("h3.name").text()
        list.push({i,name,price,img})
    })
    return list
    }catch(ex){
        console.log({ex})
    }
}