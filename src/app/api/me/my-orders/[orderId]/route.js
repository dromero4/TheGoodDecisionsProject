import { getCurrentUser } from "@/app/lib/auth";
import { deleteOrder } from "@/app/lib/orders/deleteOrder";
import { prisma } from "@/app/lib/prisma";

export async function DELETE({ params }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }

    const { orderId } = await params;

    if (!orderId) {
      return new Response(JSON.stringify({ error: "ID de pedido es requerido" }), { status: 400 });
    }

    await deleteOrder(user.id, orderId);
    return new Response(JSON.stringify({ message: "Pedido eliminado correctamente" }), { status: 200 });

  } catch (error){
    console.error("Error al eliminar el pedido:", error);
    return new Response(JSON.stringify({ error: "Error al eliminar el pedido" }), { status: 500 });
  }
}