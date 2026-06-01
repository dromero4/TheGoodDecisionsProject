import { prisma } from "@/app/lib/prisma";
import { Resend } from "resend";

import crypto from "crypto";
import { emailTemplate } from "@/app/lib/email/orderEmail";
import { validateEmailPasswordRecovery } from "@/app/lib/validations/authValidation";

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
        const RESET_URL = process.env.NEXT_PUBLIC_APP_URL + `/auth/reestablecer-password?token=${token}`

        //RESEND
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
            from: SENDER,
            to: email,
            subject: "Recupera tu contraseña",
            html: emailTemplate(RESET_URL),
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