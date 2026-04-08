export default async function testRoly() {
    console.log("Testing Roly function");
    try {
        const token = await getToken();
        console.log("TOKEN:", token);
    } catch (error) {
        console.error("Error in testRoly function:", error);
        throw error;
    }
}