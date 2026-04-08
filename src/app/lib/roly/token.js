export default async function getToken() {
    try {
        const response = await axios.get("https://clientsws.gorfactory.es:2096/api/v1/login")
        return response.data.token;
    } catch (error) {
        console.error("Error fetching token:", error);
        throw error;
    }
}