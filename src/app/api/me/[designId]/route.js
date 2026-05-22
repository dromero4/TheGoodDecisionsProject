import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(request, { params }) {
    const { designId } = await params;

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

        await prisma.designLike.upsert({
            where: {
                userId_designId: {
                    userId: user.id,
                    designId: designId,
                },
            },
            update: {},
            create: {
                userId: user.id,
                designId: designId,
            },
        });

        const likesCount = await prisma.designLike.count({
            where: {
                designId: designId,
            },
        });

        return new Response(
            JSON.stringify({
                likesCount,
                hasLiked: true,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

    } catch (error) {
        console.log("Error al editar los likes del diseño", error)
        return new Response(JSON.stringify({ error: "Error al editar los likes del diseño" }, { status: 500 }));
    }
}

export async function DELETE(request, { params }) {
    const { designId } = await params;

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

        await prisma.designLike.delete({
            where: {
                userId_designId: {
                    userId: user.id,
                    designId: designId
                }
            }
        })

        const likesCount = await prisma.designLike.count({
            where: {
                designId: designId,
            },
        });

        return new Response(
            JSON.stringify({
                likesCount,
                hasLiked: false,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    } catch (error) {
        console.error("Ha habido un error a la hora de quitar el like del diseño", error)
        return new Response(
            JSON.stringify(
                { error: "Ha habido un error a la hora de quitar el like del diseño" },
                { status: 500 }));
    }
}