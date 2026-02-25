import "dotenv/config";
import { prisma } from "../../lib/prisma.js"; // ✅ OJO: sube 2 niveles desde scripts/db/

async function reset() {
  console.log("⚠️ Resetting database...");

  // Hijas primero
  await prisma.image.deleteMany({});
  await prisma.price.deleteMany({});
  await prisma.variant.deleteMany({});
  await prisma.product.deleteMany({});

  // Raws al final
  await prisma.rawProducts.deleteMany({});

  console.log("✅ Database cleared");
}

reset()
  .catch((e) => {
    console.error("❌ reset-db error:", e?.message || e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });