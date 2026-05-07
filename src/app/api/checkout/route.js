import Stripe from "stripe";
import { randomUUID } from "crypto";
import { saveOrder } from "@/app/lib/orderStore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function buildOrderSummary(items) {
  return items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    category: item.category,
    selectedColor: item.selectedColor,
    sizes: item.sizes,
    totalUnits: item.totalUnits,
    garmentBaseTotal: item.garmentBaseTotal,
    customizationTotal: item.customizationTotal || 0,
    finalTotal: item.finalTotal,
    customization: item.customization
      ? {
          placements: item.customization.placements?.map((placement) => ({
            zoneLabel: placement.zoneLabel,
            techniqueLabel: placement.techniqueLabel,
            requestedSize: placement.requestedSize,
            chargedSize: placement.chargedSize,
            totalPrice: placement.totalPrice,
          })),
        }
      : null,
  }));
}

export async function POST(request) {
  try {
    const body = await request.json();
    const items = body.items || [];
    const customerEmail = body.customerEmail || "";

    if (!items.length) {
      return Response.json(
        { error: "No hay productos en el carrito." },
        { status: 400 }
      );
    }

    const lineItems = items.map((item) => ({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(Number(item.finalTotal || 0) * 100),
        product_data: {
          name: `${item.productId} - ${item.productName}`,
          description: [
            `Color: ${item.selectedColor}`,
            `Unidades: ${item.totalUnits}`,
            item.customization
              ? `Personalización: ${item.customization.placements?.length || 0} elemento(s)`
              : "Sin personalización",
          ].join(" · "),
        },
      },
    }));

    const orderSummary = buildOrderSummary(items);

    const orderId = randomUUID();

saveOrder(orderId, {
  items: orderSummary,
  cartTotal: items.reduce((sum, item) => sum + Number(item.finalTotal || 0), 0),
  createdAt: new Date().toISOString(),
});

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,

      customer_email: customerEmail || undefined,

      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,

      metadata: {
        orderId,
      },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("STRIPE_CHECKOUT_ERROR:", error);

    return Response.json(
      { error: "Error creando la sesión de pago." },
      { status: 500 }
    );
  }
}