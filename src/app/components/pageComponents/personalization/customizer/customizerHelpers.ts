import { PRODUCT_ZONES } from "./customizerConstants";
import { 
    CustomElement, 
    EmbroideryType, 
    ProductFeatureFlags, 
    ProductState, 
    ProductType, 
    ProductZone, 
    ScreenprintType 
} 
from "./customizerTypes";

export function formatMoney(value: number) {
  return `${Number(value || 0).toFixed(2)} €`;
}

export function getProductZones(
  productType: ProductType,
  productFeatures: ProductFeatureFlags = {}
) {
  const baseZones = PRODUCT_ZONES[productType] || PRODUCT_ZONES.tshirt;

  return baseZones.filter((zone) => {
    if (!zone.requires) return true;
    return Boolean(productFeatures[zone.requires]);
  });
}

export function createEmptyState(zones: ProductZone[]): ProductState {
  return zones.reduce((acc, zone) => {
    acc[zone.id] = { elements: [] };
    return acc;
  }, {} as ProductState);
}

export function createId() {
  return Math.random().toString(36).slice(2, 10);
}

export function normalizeText(value?: string | null) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function inferProductConfigFromCategory(category?: string | null) {
  const text = normalizeText(category);

  if (
    text.includes("hoodie") ||
    text.includes("sudadera") ||
    text.includes("hooded")
  ) {
    return {
      productType: "hoodie" as ProductType,
      productFeatures: {
        hasHood: true,
        hasPocket:
          text.includes("pocket") ||
          text.includes("bolsillo") ||
          text.includes("kangaroo"),
        hasBackPocket: false,
        hasWaistband: false,
      },
    };
  }

  if (
    text.includes("pant") ||
    text.includes("jogger") ||
    text.includes("trouser") ||
    text.includes("pantalon")
  ) {
    return {
      productType: "pants" as ProductType,
      productFeatures: {
        hasHood: false,
        hasPocket: false,
        hasBackPocket:
          text.includes("back pocket") ||
          text.includes("bolsillo trasero"),
        hasWaistband:
          text.includes("waist") ||
          text.includes("cintura") ||
          text.includes("waistband"),
      },
    };
  }

  if (text.includes("cap") || text.includes("gorra")) {
    return {
      productType: "cap" as ProductType,
      productFeatures: {
        hasHood: false,
        hasPocket: false,
        hasBackPocket: false,
        hasWaistband: false,
      },
    };
  }

  return {
    productType: "tshirt" as ProductType,
    productFeatures: {
      hasHood: false,
      hasPocket: false,
      hasBackPocket: false,
      hasWaistband: false,
    },
  };
}

export function getTechniqueVariant(element: CustomElement) {
  if (element.technique === "embroidery") {
    if (element.embroideryType === "bordado_3d") return "3d";
    return element.embroideryType || "mixto";
  }

  if (element.technique === "screenprint") {
    return element.screenprintType || "plana";
  }

  if (element.technique === "vinyl") {
    return element.vinylType || "textil_flex";
  }

  if (element.technique === "rhinestones") {
    return element.rhinestonesType || "6ss";
  }

  return "";
}


export function formatTechnique(el: CustomElement) {
  if (el.technique === "embroidery") {
    return `Bordado${el.embroideryType ? ` · ${humanEmbroidery(el.embroideryType)}` : ""
      }`;
  }
  if (el.technique === "screenprint") {
    return `Serigrafía${el.screenprintType ? ` · ${humanScreenprint(el.screenprintType)}` : ""
      }`;
  }
  if (el.technique === "dtf") return "DTF";
  if (el.technique === "dtg") return "DTG";
  if (el.technique === "rhinestones") {
    return `Pedrería${el.rhinestonesType ? ` · ${humanRhinestones(el.rhinestonesType)}` : ""
      }`;
  }

  if (el.technique === "vinyl") {
    return `Vinilo${el.vinylType ? ` · ${humanVinyl(el.vinylType)}` : ""}`;
  }
  if (el.technique === "patch") return "Parche bordado";

  return el.technique;
}

export function humanEmbroidery(type: EmbroideryType) {
  if (type === "matizado") return "Matizado";
  if (type === "mixto") return "Mixto";
  if (type === "salto_puntada") return "Salto de puntada";
  if (type === "bordado_3d") return "3D";
  return type;
}

export function humanScreenprint(type: ScreenprintType) {
  if (type === "plana") return "Plana";
  if (type === "puff") return "Puff";
  return type;
}

export function humanVinyl(type: string) {
  if (type === "textil_flex") return "Textil Flex";
  if (type === "brick_600") return "Brick 600";
  if (type === "brick_1000") return "Brick 1000";
  if (type === "electric_holografic") return "Electric / Holografic";
  if (type === "flock") return "Flock";
  if (type === "glitter") return "Glitter";
  if (type === "reflectante") return "Reflectante";
  return type;
}

export function humanRhinestones(type: string) {
  if (type === "6ss") return "6SS / 2 mm";
  if (type === "10ss") return "10SS / 3 mm";
  if (type === "16ss") return "16SS / 4 mm";
  if (type === "20ss") return "20SS / 5 mm";
  return type;
}