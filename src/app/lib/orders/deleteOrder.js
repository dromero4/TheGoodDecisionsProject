import { prisma } from "../prisma";

export async function deleteOrder(userId, orderId) {
    if (!userId || !orderId) {
        throw new Error("User ID and Order ID are required to delete an order.");
    }

    const deletedOrder = await prisma.order.deleteMany({
        where: {
            id: orderId,
            userId: userId
        },
    });

    if (deletedOrder.count === 0) {
        throw new Error("No se encontró el pedido o no tienes permiso para eliminarlo.");
    }

    return deletedOrder;
}