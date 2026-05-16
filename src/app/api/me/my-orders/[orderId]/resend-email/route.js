import { getCurrentUser } from "@/app/lib/auth";
import { sendOrderConfirmationEmail } from "@/app/lib/email/orderEmail";
import { prisma } from "@/app/lib/prisma";

export async function POST(request, { params }) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
        }

        const { orderId } = await params;

        if (!orderId) {
            return new Response(JSON.stringify({ error: "ID de pedido es requerido" }), { status: 400 });
        }

        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId: user.id
            },
        });

        if (!order) {
            return new Response(JSON.stringify({ error: "Pedido no encontrado" }), { status: 404 });
        }

        // Aquí luego enviamos el mail con Resend
        await sendOrderConfirmationEmail({
            to: order.customerEmail,
            order: order.items,
            session: {
                id: order.stripeSessionId || order.id,
                amount_total: Math.round(order.cartTotal * 100),
            },
            shippingAddress: order.shippingAddress,
        })

        return Response.json({
            success: true,
            message: "Correo reenviado correctamente",
        });
    } catch (error) {
        console.error("Error al reenviar el correo:", error);

        return Response.json(
            { error: "Error al reenviar el correo" },
            { status: 500 }
        );
    }
}