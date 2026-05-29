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

export const emailTemplate = (RESET_URL) => {
  return (
    `
        <div style="margin:0; padding:0; background-color:#f8fafc; font-family:Arial, Helvetica, sans-serif;">
            <div style="max-width:560px; margin:0 auto; padding:40px 20px;">
                <div style="background-color:#ffffff; border:1px solid #e2e8f0; border-radius:24px; padding:32px; box-shadow:0 10px 30px rgba(15, 23, 42, 0.06);">
                    
                    <p style="margin:0 0 12px; font-size:12px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:#94a3b8;">
                        Recuperación de cuenta
                    </p>

                    <h1 style="margin:0; font-size:28px; line-height:1.2; color:#020617; font-weight:800;">
                        Recupera tu contraseña
                    </h1>

                    <p style="margin:18px 0 0; font-size:15px; line-height:1.7; color:#475569;">
                        Hemos recibido una solicitud para cambiar la contraseña de tu cuenta.
                        Haz clic en el siguiente botón para crear una nueva contraseña.
                    </p>

                    <div style="margin:28px 0;">
                        <a href="${RESET_URL}" style="display:inline-block; width:100%; box-sizing:border-box; text-align:center; background-color:#020617; color:#ffffff; text-decoration:none; padding:14px 20px; border-radius:16px; font-size:13px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase;">
                            Cambiar contraseña
                        </a>
                    </div>

                    <p style="margin:0; font-size:13px; line-height:1.6; color:#64748b;">
                        Si no has solicitado este cambio, puedes ignorar este correo. Tu contraseña actual seguirá siendo válida.
                    </p>

                    <div style="margin-top:28px; padding-top:20px; border-top:1px solid #e2e8f0;">
                        <p style="margin:0; font-size:12px; line-height:1.6; color:#94a3b8;">
                            Por seguridad, este enlace caducará dentro de 10 minutos.
                        </p>
                    </div>
                </div>

                <p style="margin:20px 0 0; text-align:center; font-size:12px; color:#94a3b8;">
                    Este es un email automático, por favor no respondas a este mensaje.
                </p>

                <p style="margin:16px 0 0; font-size:12px; line-height:1.6; color:#94a3b8; word-break:break-all;">
    Si el botón no funciona, copia y pega este enlace en tu navegador:<br />
    <a href="${RESET_URL}" style="color:#020617;">${RESET_URL}</a>
</p>
            </div>
        </div>
    `
  )
}