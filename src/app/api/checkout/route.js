import Stripe from "stripe";

import { buildOrderSummary } from "@/app/lib/orders/buildOrderSummary";
import { buildStripeLineItems } from "@/app/lib/orders/buildStripeLineItems";
import { validateCheckoutPayload } from "@/app/lib/orders/validateCheckout";
import {
  attachStripeSessionToOrder,
  createPendingOrder,
} from "@/app/lib/orders/createOrder";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();

    const items = body.items || [];
    const customerEmail = body.customerEmail || "";
    const shippingAddress = body.shippingAddress || null;

    validateCheckoutPayload({
      items,
      shippingAddress,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl?.startsWith("http://") && !appUrl?.startsWith("https://")) {
      throw new Error(`NEXT_PUBLIC_APP_URL inválida. Valor actual: ${appUrl}`);
    }

    const orderSummary = buildOrderSummary(items);
    const lineItems = buildStripeLineItems(items);

    const cartTotal = items.reduce((sum, item) => {
      return sum + Number(item.finalTotal || 0);
    }, 0);

    const order = await createPendingOrder({
      customerEmail,
      orderSummary,
      shippingAddress,
      cartTotal,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,

      customer_email: customerEmail || undefined,

      success_url: `${appUrl}/checkout/success`,
      cancel_url: `${appUrl}/checkout/cancel`,

      metadata: {
        orderId: order.id,
      },
    });

    await attachStripeSessionToOrder({
      orderId: order.id,
      stripeSessionId: session.id,
    });

    return Response.json({
      url: session.url,
    });
  } catch (error) {
    console.error("STRIPE_CHECKOUT_ERROR:", error);

    return Response.json(
      {
        error: "Error creando la sesión de pago.",
        message: error.message,
        type: error.type,
        code: error.code,
      },
      { status: 500 }
    );
  }
}