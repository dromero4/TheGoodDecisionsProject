import { prisma } from "@/app/lib/prisma"

export async function GET() {
    try {
        const designs = await prisma.design.findMany({
            where: {
                isPublic: true
            },
            include: {
                user: true
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return new Response(JSON.stringify(designs, { status: 200 }));
    } catch (error) {
        console.error("Ha habido un error a la hora de conseguir los diseños de la comunidad")
        return new Response(JSON.stringify(error, { status: 500 }))
    }
}