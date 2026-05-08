import { getFullProductCatalog } from "@/app/lib/Providers/stanley";

export async function GET() {
    try {
        const products = await getFullProductCatalog();
        
        return Response.json(products);
    } catch (error) {
        console.error(error);
        return new Response("Error fetching products", { status: 500 })
    }
}