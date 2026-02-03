import axios from "axios";

export async function GetStanleyProducts() {
    try {

        const response = await axios.post(
            "https://api.stanleystella.com/webrequest/products/get_json"
            , {
                jsonrpc: "2.0",
                method: "call",
                params: {
                    db_name: process.env.STANLEY_DB,
                    user: process.env.STANLEY_USER,
                    password: process.env.STANLEY_PASS,
                    LanguageCode: "en_US",
                    Qty: 1,
                    PriceList: "Small Brand EUR"
                },
                id: 1
        });

        let data = response.data.result; //string
        

        //Queremos pasarlo a object (JSON)
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (error) {
                console.error("Error:", error);
                throw new Error("Invalid JSON from Stanley")
            }
        }


        const map = new Map();

        for (const product of data) {
            if (!map.has(product.StyleCode)) {
                map.set(product.StyleCode, {
                    code: product.StyleCode,
                    name: product.StyleName,
                    variants: []
                })
            }

            map.get(product.StyleCode).variants.push({
                sku: product.B2BSKUREF,
                color: product.Color,
                size: product.SizeCode,
                colorCode: product.ColorCode,
                shortDescription: product.ShortDescription,
                longDescription: product.LongDescription
            })
        }

        return Array.from(map.values());
    } catch (error) {
        console.log("There was an error:", error)
        throw error;
    }


}

