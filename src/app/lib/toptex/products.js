import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default async function getProducts() {
    const token = await authenticate();
    
    try {
        const response = await axios.get(process.env.TOPTEX_API_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
    }
}