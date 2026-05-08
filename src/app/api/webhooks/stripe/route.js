import Stripe from "stripe";
import { Resend } from "resend";

import { prisma } from "@/app/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export const runtime = "nodejs";

function formatMoney(value) {
  return `${Number(value || 0).toFixed(2)} €`;
}

function renderOrderEmail({ order, session, shippingAddress }) {
  const totalPaid = formatMoney((session.amount_total || 0) / 100);

  const itemsHtml = order
    .map((item) => {
      const sizes = item.sizes
        ?.map((size) => `${size.size} x${size.quantity}`)
        .join(", ");

      const customizationHtml = item.customization?.placements?.length
        ? `
          <ul style="margin:8px 0 0;padding-left:18px;color:#475569;">
            ${item.customization.placements
          .map(
            (placement) => `
                  <li>
                    ${placement.zoneLabel || "Zona"} · ${placement.techniqueLabel || "Personalización"}
                    · tamaño ${placement.requestedSize || "-"}
                    · ${formatMoney(placement.totalPrice)}
                  </li>
                `
          )
          .join("")}
          </ul>
        `
        : `<p style="margin:8px 0 0;color:#64748b;">Sin personalización</p>`;

      return `
        <div style="border:1px solid #e2e8f0;border-radius:16px;padding:16px;margin-bottom:14px;background:#ffffff;">
          <h3 style="margin:0 0 8px;font-size:16px;color:#0f172a;">
            ${item.productId || ""} - ${item.productName || "Producto"}
          </h3>

          <p style="margin:0;color:#475569;font-size:14px;">
            Color: <strong>${item.selectedColor || "-"}</strong><br/>
            Unidades: <strong>${item.totalUnits || 0}</strong><br/>
            Tallas: <strong>${sizes || "-"}</strong>
          </p>

          <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#0f172a;font-size:14px;font-weight:700;">
              Personalización
            </p>
            ${customizationHtml}
          </div>

          <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e2e8f0;color:#475569;font-size:14px;">
            <p style="margin:0;">Prendas: <strong>${formatMoney(item.garmentBaseTotal)}</strong></p>
            <p style="margin:4px 0 0;">Personalización: <strong>${formatMoney(item.customizationTotal)}</strong></p>
            <p style="margin:8px 0 0;font-size:15px;color:#0f172a;">
              Total producto: <strong>${formatMoney(item.finalTotal)}</strong>
            </p>
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <div style="font-family:Arial, sans-serif;background:#f8fafc;padding:32px;">
      <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:24px;padding:28px;border:1px solid #e2e8f0;">
        <h1 style="margin:0;color:#0f172a;font-size:24px;">
          Pedido confirmado
        </h1>

        <p style="color:#475569;font-size:15px;line-height:1.6;">
          Hemos recibido correctamente el pago de tu pedido. Te adjuntamos el resumen de la compra y de las personalizaciones aplicadas.
        </p>

        <div style="margin:20px 0;padding:16px;border-radius:16px;background:#f1f5f9;">
          <p style="margin:0;color:#475569;font-size:14px;">
            ID de sesión Stripe:<br/>
            <strong style="color:#0f172a;">${session.id}</strong>
          </p>
          <p style="margin:10px 0 0;color:#475569;font-size:14px;">
            Total pagado:<br/>
            <strong style="color:#0f172a;font-size:18px;">${totalPaid}</strong>
          </p>
        </div>
        ${shippingAddress ? `
  <div style="margin:20px 0;padding:16px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;">
    <h2 style="margin:0 0 10px;color:#0f172a;font-size:16px;">
      Dirección de entrega
    </h2>

    <p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">
      <strong>${shippingAddress.fullName || "-"}</strong><br/>
      ${shippingAddress.street || ""} ${shippingAddress.number || ""} ${shippingAddress.floorDoor || ""}<br/>
      ${shippingAddress.postalCode || ""} ${shippingAddress.city || ""}, ${shippingAddress.province || ""}<br/>
      ${shippingAddress.country || ""}<br/>
      Tel: ${shippingAddress.phone || "-"}
      ${shippingAddress.additionalInfo
        ? `<br/>Notas: ${shippingAddress.additionalInfo}`
        : ""
      }
    </p>
  </div>
` : ""}

        ${itemsHtml}

        <p style="margin-top:24px;color:#64748b;font-size:13px;line-height:1.5;">
          Este correo se ha generado automáticamente tras la confirmación del pago.
        </p>
      </div>
    </div>
    
  `;
}

export async function POST(request) {


  const signature = request.headers.get("stripe-signature");

  let event;

  try {
    const rawBody = await request.text();

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("STRIPE_WEBHOOK_SIGNATURE_ERROR:", error.message);

    return Response.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
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

      const customerEmail =
        session.customer_details?.email ||
        session.customer_email;

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
          paymentStatus: "paid",
          emailSent: true,
        },
      });


      console.log("ORDER_CONFIRMATION_EMAIL_SENT:", customerEmail);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("STRIPE_WEBHOOK_HANDLER_ERROR:", error);

    return Response.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}