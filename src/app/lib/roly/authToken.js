import axios from "axios";
import { configDotenv } from "dotenv";

configDotenv();

export default async function getAuthToken() {
    try {

        const form = new FormData();
        form.append("username", process.env.ROLY_USER);
        form.append("password", process.env.ROLY_PASS);
        const response = await axios.post(
            "https://clientsws.gorfactory.es:2096/api/v1/login",
            form,
            {
                headers: {
                    Accept: "*/*",
                    // NO pongas Content-Type a mano: axios lo calcula con boundary
                },
            }
        );

        return response.data.token;
    } catch (error) {
        console.error('Error al obtener el token de autenticación:', error);
        throw error;
    }
}