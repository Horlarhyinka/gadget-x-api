const cheerio = require("cheerio");
const axios = require("axios");

exports.scrape = async (url) => {
    try {
        // Step 1: Initial request to get the page and CSRF token
        const initialResponse = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            },
        });

        // Load the page into cheerio
        const $ = cheerio.load(initialResponse.data);

        // Step 2: Extract the CSRF token
        const csrfToken = $('input[name="csrf_token"]').val();  // Change the selector based on the actual HTML structure

        // If the CSRF token is stored in a meta tag or somewhere else, adjust the selector accordingly
        // const csrfToken = $('meta[name="csrf-token"]').attr('content'); 

        // Step 3: Use the CSRF token in a subsequent request
        // const _path = "#jm > main > div.aim.row.-pbm > div.-pvs.col12 > section > div.-paxs.row._no-g._4cl-3cm-shs";
        const _path = "#jm > main > div.aim.row.-pbm > div.-pvs.col12 > section > div.-paxs.row._no-g._4cl-3cm-shs"

        const datas = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
                "X-CSRF-Token": csrfToken,
                // Include any other headers that might be necessary, like cookies or referer
            },
        });

        const $2 = cheerio.load(datas.data);
        const list = [];

        $2(_path).children().each((i, child) => {
            const img = $2(child).find("img.img").attr("data-src");
            const price = $2(child).find("div.prc").text();
            const name = $2(child).find("h3.name").text();
            list.push({ i, name, price, img });
        });

        return list;
    } catch (ex) {
        console.log({ ex });
        return null;
    }
};
