import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
    try {
        const user = await getCurrentUser();

        const designs = await prisma.design.findMany({
            where: {
                isPublic: true,
            },
            include: {
                user: true,

                _count: {
                    select: {
                        userLiked: true,
                    },
                },

                userLiked: {
                    where: {
                        userId: user?.id ?? "__NO_USER__",
                    },
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const designsWithLikes = designs.map((design) => {
            const { _count, userLiked, ...restOfDesign } = design;

            return {
                ...restOfDesign,
                likesCount: _count.userLiked,
                hasLiked: userLiked.length > 0,
            };
        });

        return new Response(JSON.stringify(designsWithLikes), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });

    } catch (error) {
        console.error("Ha habido un error a la hora de conseguir los diseños de la comunidad", error);

        return new Response(
            JSON.stringify({ error: "Error al conseguir los diseños de la comunidad" }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}