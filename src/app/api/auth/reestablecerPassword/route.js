import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs"

export async function POST(request) {
    try {
        const body = await request.json();

        const token = body.token;
        const password = body.password;
        const confirmPassword = body.confirmPassword;

        //PUEDE SER QUE LO MUEVA A UN FICHERO APARTE
        //---
        if(!password || !confirmPassword) return new Response(JSON.stringify({
            message: "Faltan datos obligatorios",
            status: 400
        }))

        if(password !== confirmPassword) return new Response(JSON.stringify({
            message: "Las contraseñas no coinciden, vuelve a intentarlo.",
            status: 400
        }))

        if(password.length < 4) return new Response(JSON.stringify({
            message: "La contraseña tiene que tener más de 4 carácteres.",
            status: 400
        }))
        //---

        //VERIFICACIÓN DE TOKEN
        const token_db = await prisma.PasswordResetToken.findUnique({
            where: {
                token
            },
            include: {
                user: true
            }
        })

        if(!token_db) return new Response(JSON.stringify({
            message: "Token inválido",
            status: 404
        }));

        if(token_db.used) return new Response(JSON.stringify({
            message: "Este enlace ya ha sido utilizado",
            status: 400
        }))

        if(token_db.expiresAt < new Date()) return new Response(JSON.stringify({
            message: "El enlace ha caducado",
            status: 400
        }))        

        //FINALMENTE HASHEAR LA CONTRASEÑA Y GUARDARLA EN LA BASE DE DATOS
        const hashedPassword = await bcrypt.hash(password, 10);

        //Update a la contraseña del usuario
        await prisma.user.update({
            where: {
                id: token_db.userId
            },
            data: {
                passwordHash: hashedPassword
            }
        });

        //Update al "used" del token
        await prisma.PasswordResetToken.update({
            where: {
                id: token_db.id
            },
            data: {
                used: true
            }
        });

        return new Response(JSON.stringify({
            message: "Contraseña cambiada correctamente.",
            status: 200
        }));

    } catch (error) {
        console.log("Ha habido un error al cambiar la contraseña", error)
        return new Response(JSON.stringify({error, message: "Ha habido un error al cambiar la contraseña"}, { status: 500 }));
    }
}