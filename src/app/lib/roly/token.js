import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default async function getToken() {
  try {
    const body = new URLSearchParams();
    body.append("username", process.env.ROLY_USER);
    body.append("password", process.env.ROLY_PASS);

    const response = await axios.post(
      "https://clientsws.gorfactory.es:2096/api/v1/login",
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      }
    );

    return response.data.token;
  } catch (error) {
    console.error(
      "Error fetching token:",
      error.response?.status,
      error.response?.data || error.message
    );
    throw error;
  }
}