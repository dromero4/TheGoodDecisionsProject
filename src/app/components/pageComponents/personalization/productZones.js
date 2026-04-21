export const PRODUCT_ZONES = {
  tshirt: [
    { id: "front", label: "Frente" },
    { id: "back", label: "Espalda" },
    { id: "leftSleeve", label: "Manga izquierda" },
    { id: "rightSleeve", label: "Manga derecha" },
    { id: "neck", label: "Cuello" },
  ],

  hoodie: [
    { id: "front", label: "Frente" },
    { id: "back", label: "Espalda" },
    { id: "leftSleeve", label: "Manga izquierda" },
    { id: "rightSleeve", label: "Manga derecha" },
    { id: "neck", label: "Cuello" },
    { id: "hood", label: "Capucha", requires: "hasHood" },
    { id: "pocket", label: "Bolsillo", requires: "hasPocket" },
  ],

  pants: [
    { id: "frontRightLeg", label: "Pierna derecha frontal" },
    { id: "frontLeftLeg", label: "Pierna izquierda frontal" },
    { id: "backRightLeg", label: "Pierna derecha trasera" },
    { id: "backLeftLeg", label: "Pierna izquierda trasera" },
    { id: "waist", label: "Cintura" },
    { id: "backPocket", label: "Bolsillo trasero", requires: "hasBackPocket" },
  ],

  cap: [
    { id: "front", label: "Frontal" },
    { id: "leftSide", label: "Lateral izquierdo" },
    { id: "rightSide", label: "Lateral derecho" },
    { id: "back", label: "Trasera" },
    { id: "visor", label: "Visera" },
  ],
};

export function getProductZones(productType, productFeatures = {}) {
  const baseZones = PRODUCT_ZONES[productType] || PRODUCT_ZONES.tshirt;

  return baseZones.filter((zone) => {
    if (!zone.requires) return true;
    return Boolean(productFeatures[zone.requires]);
  });
}