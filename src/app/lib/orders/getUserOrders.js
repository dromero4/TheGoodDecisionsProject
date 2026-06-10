import { prisma } from "@/app/lib/prisma";


export default async function getUserOrders(userId) {
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
}