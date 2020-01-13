const axios = require("axios")
const cheerio = require('cheerio');
const fast_csv = require('fast-csv');
const fs = require('fs');
const url = "https://www.eia.gov/dnav/ng/hist/rngwhhdD.htm"
const ws = fs.createWriteStream("data.csv");
(async function () {
    try {
        const response = await axios.get(url);
        const { data } = response;
        const $ = cheerio.load(data);
        const tableData = $('table:nth-of-type(3)');
        let normalizeData = [];
        tableData.each(function () {
            const date = $(this).find('.B6').text();
            const price = $(this).find('.B3').text();
            normalizeData.push({ date, price });
        });
        fast_csv.write(normalizeData, { headers: true }).pipe(ws);
    } catch (error) {
        console.error(error);
    }
}()); 
