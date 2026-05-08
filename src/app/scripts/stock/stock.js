import { prisma } from "../../lib/prisma.js";

async function main() {
  const result = await prisma.variant.updateMany({
    data: {
      stock: 500,
    },
  });

  console.log(`Stock actualizado en ${result.count} variantes.`);
}

main()
  .catch((error) => {
    console.error("Error actualizando stock:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });