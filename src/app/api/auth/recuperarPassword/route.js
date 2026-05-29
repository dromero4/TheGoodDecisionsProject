import { prisma } from "@/app/lib/prisma";
import { Resend } from "resend";

import crypto from "crypto";

export async function POST(request) {
    try {
        const body = await request.json();
        const { email } = body;

        const SENDER = process.env.ORDER_EMAIL_FROM

        if (!email) return new Response({ message: "El email es obligatorio", status: 400 });

        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if (!user) return new Response(JSON.stringify({
            status: 500,
            message: "No hay ningun usuario con ese email"
        }));

        //TOKEN
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) 

        await prisma.PasswordResetToken.create({
            data: {
                token,
                userId: user.id,
                expiresAt
            }
        })
        const RESET_URL = process.env.NEXT_PUBLIC_APP_URL + `/reestablecer-password?token=${token}`

        //RESEND
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: SENDER,
            to: email,
            subject: "Recupera tu contraseña",
            html: `
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
    `,
        });

        return new Response(JSON.stringify({
            status: 200,
            message: `Enviando correo a ${email}`
        }))
    } catch (error) {
        console.error("HA HABIDO UN ERROR AL ENVIAR EL CORREO", error);
        return new Response(JSON.stringify({
            status: 500,
            error: "Ha habido un error al enviar el correo."
        }))
    }
}