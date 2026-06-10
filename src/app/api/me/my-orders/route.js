// de aqui cogemos los pedidos de la base de datos para posteriormente 
// pasarlos al frontend

import { getCurrentUser } from "@/app/lib/auth";
import getUserOrders from "@/app/lib/orders/getUserOrders";


// ENDPOINT: GET /api/me/my-orders

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return Response.json({ error: "No autorizado." }, { status: 401 });
    }
    
    const orders = await getUserOrders(user.id);
    return Response.json(orders);
}

