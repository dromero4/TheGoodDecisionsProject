import axios from "axios";

export async function GetPrices() {
    try {
        const response = await axios.post('https://api.stanleystella.com/webrequest/products/get_prices', {
            jsonrpc: "2.0",
            method: "call",
            params: {
                db_name: process.env.STANLEY_DB,
                user: process.env.STANLEY_USER,
                password: process.env.STANLEY_PASS,
            },
            id: 1
        });

        let data = response.data.result;

        //Queremos pasarlo a object (JSON)
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (error) {
                console.error("Error:", error);
                throw new Error("Invalid JSON from Stanley")
            }
        }

        const prices = [];

        for (const p of data){
            prices.push({
                B2BSKUREF: p.B2BSKUREF,
                price_per_unit: p.PurchasePrice,
                price_gt_10: p.RecommendedSalesPriceGT10pcs,
                price_gt_100: p.RecommendedSalesPriceGT100pcs,
                price_gt_500: p.RecommendedSalesPriceGT500pcs,
                price_gt_1000: p.RecommendedSalesPriceGT1000pc
            });
        }

        return prices;

    } catch (error){
        console.error("There was an error fetching the data...", error);
        throw error;
    }
}