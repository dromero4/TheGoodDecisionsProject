import axios from 'axios';

export async function GetStanleyImages(){
    try {
        const response = await axios.post('https://api.stanleystella.com/webrequest/products_images/get_json', {
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

        const images = [];

        for (const img of data){
            images.push({
                code: img.StyleCode,
                colorCode: img.ColorCode,
                image: img.HTMLPath                
            })
        }

        return images;
    } catch (error){
        console.error("There was an error fetching the data...", error);
        throw error;
    }
}