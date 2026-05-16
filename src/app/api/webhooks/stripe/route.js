import Stripe from "stripe";
import { Resend } from "resend";

import { prisma } from "@/app/lib/prisma";
import { renderOrderEmail } from "@/app/lib/email/orderEmail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export const runtime = "nodejs";

/*
  Webhook que recibe Stripe cuando se completa el pago de una sesión de checkout.
  Cuando Stripe recibe el pago, recuperamos la orden asociada, enviamos el mail y 
  actualizamos su estado.
*/

function formatMoney(value) {
  return `${Number(value || 0).toFixed(2)} €`;
}



export async function POST(request) {

// Stripe requiere de firmar cada evento para comprobar que realmente viene de Stripe
  const signature = request.headers.get("stripe-signature");

  let event;

  try {
    /*
    Usamos el body sin parsear porque asi lo pide Stripe para verificar la firma.
    Si parseamos el body antes de verificar la firma, esta no coincidirá y Stripe rechazará el webhook.
    */
    const rawBody = await request.text();

    /*
    Validamos la firma del webhook usando el secret específico del endpoint que configuramos en Stripe.
    Esto es crucial para evitar que terceros puedan enviar eventos falsos a nuestro webhook y simular pagos o acciones que no han ocurrido realmente.
     - Si la firma no es válida, respondemos con un error 400 y no procesamos el evento.
     - Si la firma es válida, podemos confiar en que el evento realmente proviene de Stripe y proceder a manejarlo. 
    */
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    // Si la firma no es válida, rechazamos el webhook para evitar eventos falsos.
    console.error("STRIPE_WEBHOOK_SIGNATURE_ERROR:", error.message);

    return Response.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    // Solo nos interesa actuar cuando el pago de Checkout se ha completado correctamente.
    // Y "checkout.session.completed" es el evento que Stripe envía en ese momento.
    if (event.type === "checkout.session.completed") {

      const session = event.data.object;


      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("No orderId found in Stripe metadata.");
        return Response.json({ received: true });
      }

      const storedOrder = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      });

      if (!storedOrder) {
        console.error("Order not found:", orderId);
        return Response.json({ received: true });
      }

      const order = Array.isArray(storedOrder.items) ? storedOrder.items : [];
      const shippingAddress = storedOrder.shippingAddress || null;

      // Stripe puede devolver el email en customer_details o customer_email.
      // Si no está, usamos el email guardado en nuestra orden.
      const customerEmail =
        session.customer_details?.email ||
  session.customer_email ||
  storedOrder.customerEmail;

      if (!customerEmail) {
        console.warn("No hemos encontrado el email del cliente. No se ha enviado el correo.");
        return Response.json({ received: true });
      }




      const emailResult = await resend.emails.send({
        from: process.env.ORDER_EMAIL_FROM,
        to: customerEmail,
        bcc: process.env.ORDER_EMAIL_TO || undefined,
        subject: `Pedido confirmado - ${session.id}`,
        html: renderOrderEmail({ order, session, shippingAddress }),
      });


      if (emailResult.error) {
        console.error("RESEND_SEND_ERROR:", emailResult.error);

        return Response.json({
          received: true,
          emailSent: false,
          resendError: emailResult.error.message,
        });
      }

      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          paymentStatus: "Pagado",
          emailSent: true,
        },
      });


      console.log("ORDER_CONFIRMATION_EMAIL_SENT:", customerEmail);
    }

    return Response.json({ received: true });
  } catch (error) {
    // Si algo falla durante el procesamiento, Stripe recibirá un 500 y podrá reintentar el webhook.
    console.error("STRIPE_WEBHOOK_HANDLER_ERROR:", error);

    return Response.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}