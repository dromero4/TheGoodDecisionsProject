import { prisma } from "@/app/lib/prisma";

export async function createPendingOrder({
  customerEmail,
  orderSummary,
  shippingAddress,
  cartTotal,
}) {
  return await prisma.order.create({
    data: {
      customerEmail: customerEmail || null,
      items: orderSummary,
      shippingAddress,
      cartTotal,
      paymentStatus: "pending",
    },
  });
}

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