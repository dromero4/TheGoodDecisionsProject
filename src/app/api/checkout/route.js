// src/app/api/checkout/route.js

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const items = body.items || [];

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

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
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