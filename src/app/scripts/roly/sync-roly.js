import "dotenv/config";
import { prisma } from "../../lib/prisma.js";
import { getFullROLYProductCatalog } from "../../lib/roly/index.js";

function parseColorCode(x) {
  const n = parseInt(String(x ?? "").trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

function getBaseProductId(colorProductId) {
  // "BA909-01" -> "BA909"
  return String(colorProductId).split("-")[0];
}

function parseWeight(x) {
  const s = String(x ?? "").replace(",", ".");
  const m = s.match(/[\d.]+/);
  const n = m ? parseFloat(m[0]) : NaN;
  return Number.isFinite(n) ? n : 0;
}

async function syncRolyToDb() {
  const products = await getFullROLYProductCatalog();
  console.log(products.length, "ROLY grouped products to sync");

  for (const p of products) {
    const colorProductId = String(p.product_id);              // ej: "BA909-01"
    const baseId = getBaseProductId(colorProductId);          // ej: "BA909"
    const color_code = parseColorCode(p.product_color_code);
    const weight = parseWeight(p.product_weight);

    // 1) PRODUCTO BASE (1 por modelo)
    // Nota: aquí hacemos upsert por productId = baseId
    await prisma.rolyProduct.upsert({
      where: { productId: baseId },
      update: {
        // no sobrescribas a lo loco si cambian por color; deja algo "general"
        name: p.product_name,
        description: p.product_description ?? null,
        weight,
      },
      create: {
        productId: baseId,
        name: p.product_name,
        description: p.product_description ?? null,
        weight,
      },
    });

    // 2) VARIANTES: borras SOLO las del color actual (no todo el modelo)
    await prisma.rolyVariant.deleteMany({
      where: { productId: baseId, colorProductId },
    });

    const variants = Array.isArray(p.variants) ? p.variants : [];

    // Dedupe por talla dentro del mismo color
    const seen = new Set();
    for (const v of variants) {
      const size = String(v.size ?? "U").trim();
      if (!size) continue;
      if (seen.has(size)) continue;
      seen.add(size);

      await prisma.rolyVariant.create({
        data: {
          productId: baseId,                 // FK al base
          colorProductId,                    // ID color (modelo+color)
          size,
          color_code,
          color_name: p.product_color_name ?? "",
          name: String(v.name ?? ""),
        },
      });
    }

    // 3) IMÁGENES: borras SOLO las del color actual
    await prisma.rolyImages.deleteMany({
      where: { productId: baseId, colorProductId },
    });

    const urls = Array.isArray(p.product_viewsimages) ? p.product_viewsimages : [];
    const imageData = urls
      .map((u) => String(u ?? "").trim())
      .filter(Boolean)
      .map((url) => ({
        productId: baseId,
        colorProductId,
        url,
      }));

    if (imageData.length) {
      await prisma.rolyImages.createMany({
        data: imageData,
        skipDuplicates: true,
      });
    }
  }

  console.log("✅ ROLY sync to DB done");
}

syncRolyToDb()
  .catch((e) => {
    console.error("❌ sync error:", e?.message || e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect()); 