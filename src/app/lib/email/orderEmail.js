import { formatMoney } from "@/app/components/pageComponents/personalization/customizer/customizerHelpers";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export function renderOrderEmail({ order, session, shippingAddress }) {
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
          Te reenviamos el resumen de tu pedido y de las personalizaciones aplicadas.
        </p>

        <div style="margin:20px 0;padding:16px;border-radius:16px;background:#f1f5f9;">
          <p style="margin:0;color:#475569;font-size:14px;">
            ID de pedido:<br/>
            <strong style="color:#0f172a;">${session.id}</strong>
          </p>
          <p style="margin:10px 0 0;color:#475569;font-size:14px;">
            Total:<br/>
            <strong style="color:#0f172a;font-size:18px;">${totalPaid}</strong>
          </p>
        </div>

        ${
          shippingAddress
            ? `
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
                  ${
                    shippingAddress.additionalInfo
                      ? `<br/>Notas: ${shippingAddress.additionalInfo}`
                      : ""
                  }
                </p>
              </div>
            `
            : ""
        }

        ${itemsHtml}

        <p style="margin-top:24px;color:#64748b;font-size:13px;line-height:1.5;">
          Este correo se ha generado automáticamente desde tu cuenta.
        </p>
      </div>
    </div>
  `;
}

export async function sendOrderConfirmationEmail({
  to,
  order,
  session,
  shippingAddress,
}) {
  const emailResult = await resend.emails.send({
    from: process.env.ORDER_EMAIL_FROM,
    to,
    bcc: process.env.ORDER_EMAIL_TO || undefined,
    subject: `Resumen de tu pedido - ${session.id}`,
    html: renderOrderEmail({ order, session, shippingAddress }),
  });

  if (emailResult.error) {
    throw new Error(emailResult.error.message);
  }

  return emailResult.data;
}