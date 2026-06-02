import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const longDescriptions = await prisma.$queryRaw`
    SELECT DISTINCT "longDescription" FROM "Product"
  `;

  console.dir(longDescriptions, { depth: null , maxArrayLength: null});
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });