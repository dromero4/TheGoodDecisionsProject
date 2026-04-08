import axios from "axios";

export default async function products(token) {
    try {
        const response = await axios.get("https://clientsws.gorfactory.es:2096/api/v1/products", {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                lang: "en-US",
                brand: "roly",
            }

        });
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}