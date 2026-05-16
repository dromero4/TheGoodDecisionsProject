import Stripe from "stripe";

import { buildOrderSummary } from "@/app/lib/orders/buildOrderSummary";
import { buildStripeLineItems } from "@/app/lib/orders/buildStripeLineItems";
import { validateCheckoutPayload } from "@/app/lib/orders/validateCheckout";
import {
  attachStripeSessionToOrder,
  createPendingOrder,
} from "@/app/lib/orders/createOrder";
import { getCurrentUser } from "@/app/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const runtime = "nodejs";

/* 
  Endpoint para crear una sesión de pago con Stripe.
  Recibe un payload con los items del carrito, email del cliente y dirección de envío.
  Valida el payload, crea un resumen del pedido y los line items para Stripe.
  Luego crea una orden pendiente en la base de datos y una sesión de checkout en Stripe.
  Finalmente, devuelve la URL de la sesión para redirigir al cliente.
*/



export async function POST(request) {

  const user = await getCurrentUser();
  try {
    const body = await request.json();

    const items = body.items || [];
    const customerEmail = body.customerEmail || "";
    const shippingAddress = body.shippingAddress || null;

    /*
      Validación del payload de checkout. 
      Asegura que los items, dirección de envío y otros datos sean correctos antes de proceder.

      Sobretodo evita pagos con carritos manipulados desde el navegador.
    */
    validateCheckoutPayload({
      items,
      shippingAddress,
    });

    /*
      Validación de la URL de la aplicación.
       - Asegura que la URL de la aplicación esté configurada correctamente en las variables de entorno.
       - Esto es crucial para que las redirecciones de éxito y cancelación funcionen correctamente después del pago. 
    */
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl?.startsWith("http://") && !appUrl?.startsWith("https://")) {
      throw new Error(`NEXT_PUBLIC_APP_URL inválida. Valor actual: ${appUrl}`);
    }

    /*
      Crear una versión resumida del pedido para guardarla y usarla 
      en el mail de confirmación despues de haber recibido el pago.
    */
    const orderSummary = buildOrderSummary(items);
    const lineItems = buildStripeLineItems(items);

    const cartTotal = items.reduce((sum, item) => {
      return sum + Number(item.finalTotal || 0);
    }, 0);

    
    /*
      Guardamos el pedido como pendiente en la base de datos antes de crear la sesión de Stripe.
       - Esto nos permite tener un registro del pedido incluso si el cliente no completa el pago.
       - Además, podemos usar esta información para enviar correos de seguimiento o recuperar carritos abandonados.
    */
    const order = await createPendingOrder({
      userId: user?.id || null,
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

      /*
        Metadata para asociar la sesión de Stripe con el pedido en nuestra base de datos.
      */
      metadata: {
        orderId: order.id,
      },
    });

    /*
      Asociar la sesión de Stripe con el pedido en la base de datos.
       - Esto es crucial para poder actualizar el estado del pedido una vez que recibamos la confirmación de pago desde Stripe.
       - Nos permite también manejar casos donde el cliente no complete el pago, y eventualmente limpiar pedidos pendientes después de cierto tiempo.
    */
    await attachStripeSessionToOrder({
      orderId: order.id,
      stripeSessionId: session.id,
    });

    return Response.json({
      url: session.url,
    });
  } catch (error) {
    /*
      Devolvemos el error real para facilitar la depuración en producción 
    */
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