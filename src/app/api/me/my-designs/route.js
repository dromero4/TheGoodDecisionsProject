import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(request) {
    try {
        const res = await request.json();

        const user = await getCurrentUser();

        if (!user) {
            return new Response(JSON.stringify({ message: "Usuario no autenticado" }), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        
        await prisma.design.create({
            data: {
                name: res.name,
                category: res.category,
                Size: res.size,
                Quantity: res.quantity,
                isPublic: res.isPublic,
                payload: res.data_payload,

                userId: user.id
            }
        });

        return new Response(JSON.stringify({ message: "Diseño guardado correctamente" }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Error al guardar el diseño:", error);
        return new Response(JSON.stringify({ message: "Error al guardar el diseño" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return new Response(JSON.stringify({ message: "Usuario no autenticado" }), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        const designs = await prisma.design.findMany({
            where: {
                userId: user.id
            }
        });

        return new Response(JSON.stringify(designs), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
        
    } catch (error) {
        console.error("Error al obtener los diseños:", error);
        return new Response(JSON.stringify({ message: "Error al obtener los diseños" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}