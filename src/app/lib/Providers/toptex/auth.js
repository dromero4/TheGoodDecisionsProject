import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default async function authenticate() {
    try {

        const response = await axios.post(process.env.TOPTEX_ENDPOINT + "/v3/authenticate", {
            username: process.env.TOPTEX_USER_AUTH,
            password: process.env.TOPTEX_PASS_AUTH
        }, {
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.TOPTEX_API_KEY,
                "accept": "application/json"
            }
        });

        return response.data?.token;

    } catch (error) {
        

        const status = error?.response?.status;
    const body = error?.response?.data;
    console.error("Error authenticating:", status, body || error.message);
    throw new Error("Failed to authenticate");
    }
}