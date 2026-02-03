import axios from "axios";

export async function topTexProducts(){
    const response = await axios.get(process.env.TOPTEX_URL
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

    return response;
}