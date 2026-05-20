import { getCurrentUser } from "@/app/lib/auth";

export async function GET({ request, qty }){
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        customerEmail: user.email
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 3
      
    })

    return new Response(JSON.stringify(orders, {status: 200}));

  } catch (error) {
    console.error("Error al mostrar los pedidos", error)
    return new Response(JSON.stringify({error: "Error al mostrar los pedidos"}));
  }
}