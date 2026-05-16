// Funciones para crear el pedido en la base de datos y actualizarlo 
// posteriormente con el ID de la sesión de Stripe

import { prisma } from "@/app/lib/prisma";

/*
Creamos la orden con estado "pending" antes de crear la sesión de Stripe.
*/
export async function createPendingOrder({
  userId,
  customerEmail,
  orderSummary,
  shippingAddress,
  cartTotal,
}) {
  return await prisma.order.create({
    data: {
      userId: userId || null, // Si no hay usuario logueado, guardamos null
      customerEmail: customerEmail || null,
      items: orderSummary,
      shippingAddress,
      cartTotal,
      paymentStatus: "Pendiente",
    },
  });
}

// Guardamos el ID de la sesión de Stripe en la orden para poder verificar el pago más adelante
export async function attachStripeSessionToOrder({ orderId, stripeSessionId }) {
  return await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      stripeSessionId,
    },
  });
}