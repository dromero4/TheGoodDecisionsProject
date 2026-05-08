import type { ProductType, ProductZone, Technique } from "./customizerTypes";

export const RESIZE_HANDLE_STYLES = {
  top: {
    height: "8px",
    top: "-4px",
    cursor: "ns-resize",
  },
  right: {
    width: "8px",
    right: "-4px",
    cursor: "ew-resize",
  },
  bottom: {
    height: "8px",
    bottom: "-4px",
    cursor: "ns-resize",
  },
  left: {
    width: "8px",
    left: "-4px",
    cursor: "ew-resize",
  },
  topRight: {
    width: "12px",
    height: "12px",
    right: "-6px",
    top: "-6px",
    borderRadius: "9999px",
    background: "#2563eb",
    border: "2px solid white",
    boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
    cursor: "nesw-resize",
  },
  bottomRight: {
    width: "12px",
    height: "12px",
    right: "-6px",
    bottom: "-6px",
    borderRadius: "9999px",
    background: "#2563eb",
    border: "2px solid white",
    boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
    cursor: "nwse-resize",
  },
  bottomLeft: {
    width: "12px",
    height: "12px",
    left: "-6px",
    bottom: "-6px",
    borderRadius: "9999px",
    background: "#2563eb",
    border: "2px solid white",
    boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
    cursor: "nesw-resize",
  },
  topLeft: {
    width: "12px",
    height: "12px",
    left: "-6px",
    top: "-6px",
    borderRadius: "9999px",
    background: "#2563eb",
    border: "2px solid white",
    boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
    cursor: "nwse-resize",
  },
};

export const EMBROIDERY_3D_SIZE_OPTIONS = [
  { value: "3x3", label: "3x3 cm" },
  { value: "5x5", label: "5x5 cm" },
  { value: "7x7", label: "7x7 cm" },
  { value: "10x10", label: "10x10 cm" },
  { value: "15x15", label: "15x15 cm" },
];

export const SIZE_OPTIONS_BY_TECHNIQUE: Record<Technique, { value: string; label: string }[]> = {
  embroidery: [
    { value: "3x3", label: "3x3 cm" },
    { value: "5x5", label: "5x5 cm" },
    { value: "7x7", label: "7x7 cm" },
    { value: "10x10", label: "10x10 cm" },
    { value: "15x15", label: "15x15 cm" },
    { value: "25x25", label: "25x25 cm" },
    { value: "27x27", label: "27x27 cm" },
  ],

  patch: [
    { value: "5x5", label: "5x5 cm" },
    { value: "5x10", label: "5x10 cm" },
    { value: "10x10", label: "10x10 cm" },
    { value: "10x15", label: "10x15 cm" },
    { value: "15x15", label: "15x15 cm" },
    { value: "15x20", label: "15x20 cm" },
    { value: "20x20", label: "20x20 cm" },
    { value: "20x30", label: "20x30 cm" },
    { value: "25x25", label: "25x25 cm" },
    { value: "25x35", label: "25x35 cm" },
    { value: "27x40", label: "27x40 cm" },
    { value: "30x30", label: "30x30 cm" },
    { value: "35x35", label: "35x35 cm" },
    { value: "40x40", label: "40x40 cm" },
  ],

  dtf: [
    { value: "5x5", label: "5x5 cm" },
    { value: "5x10", label: "5x10 cm" },
    { value: "10x10", label: "10x10 cm" },
    { value: "10x14", label: "10x14 cm" },
    { value: "14x20", label: "14x20 cm" },
    { value: "20x27", label: "20x27 cm" },
    { value: "27x40", label: "27x40 cm" },
  ],

  dtg: [
    { value: "10x10", label: "10x10 cm" },
    { value: "15x20", label: "15x20 cm" },
    { value: "30x30", label: "30x30 cm" },
    { value: "34,5x49", label: "34,5x49 cm" },
  ],

  screenprint: [
    { value: "a4", label: "A4 (21x29,7 cm, centrado)" },
    { value: "a3", label: "A3 (29,7x42 cm, centrado)" },
  ],

  vinyl: [
    { value: "5x5", label: "5x5 cm" },
    { value: "5x10", label: "5x10 cm" },
    { value: "10x10", label: "10x10 cm" },
    { value: "15x10", label: "15x10 cm" },
    { value: "20x15", label: "20x15 cm" },
    { value: "30x20", label: "30x20 cm" },
    { value: "40x30", label: "40x30 cm" },
  ],

  rhinestones: [
    { value: "5x5", label: "5x5 cm" },
    { value: "5x10", label: "5x10 cm" },
    { value: "10x10", label: "10x10 cm" },
    { value: "10x15", label: "10x15 cm" },
    { value: "10x20", label: "10x20 cm" },
    { value: "10x30", label: "10x30 cm" },
    { value: "10x40", label: "10x40 cm" },
    { value: "14x15", label: "14x15 cm" },
    { value: "14x20", label: "14x20 cm" },
    { value: "15x15", label: "15x15 cm" },
    { value: "15x20", label: "15x20 cm" },
    { value: "20x20", label: "20x20 cm" },
    { value: "20x27", label: "20x27 cm" },
    { value: "20x30", label: "20x30 cm" },
    { value: "25x25", label: "25x25 cm" },
    { value: "25x35", label: "25x35 cm" },
    { value: "30x30", label: "30x30 cm" },
    { value: "30x40", label: "30x40 cm" },
    { value: "35x35", label: "35x35 cm" },
    { value: "40x40", label: "40x40 cm" },
  ],
};

export const SIZE_OPTIONS = [
  { value: "5x5", label: "5x5 cm" },
  { value: "5x10", label: "5x10 cm" },
  { value: "10x10", label: "10x10 cm" },
  { value: "10x15", label: "10x15 cm" },
  { value: "10x20", label: "10x20 cm" },
  { value: "10x30", label: "10x30 cm" },
  { value: "10x40", label: "10x40 cm" },
  { value: "14x15", label: "14x15 cm" },
  { value: "14x20", label: "14x20 cm" },
  { value: "15x15", label: "15x15 cm" },
  { value: "15x20", label: "15x20 cm" },
  { value: "20x20", label: "20x20 cm" },
  { value: "20x27", label: "20x27 cm" },
  { value: "20x30", label: "20x30 cm" },
  { value: "25x25", label: "25x25 cm" },
  { value: "25x35", label: "25x35 cm" },
  { value: "27x40", label: "27x40 cm" },
  { value: "30x30", label: "30x30 cm" },
  { value: "30x40", label: "30x40 cm" },
  { value: "34,5x49", label: "34,5x49 cm" },
  { value: "35x35", label: "35x35 cm" },
  { value: "40x40", label: "40x40 cm" },
  { value: "a5", label: "A5" },
  { value: "a4", label: "A4" },
  { value: "a3", label: "A3" },
];

export const VINYL_VARIANTS = [
  { value: "textil_flex", label: "Textil Flex" },
  { value: "brick_600", label: "Brick 600" },
  { value: "brick_1000", label: "Brick 1000" },
  { value: "electric_holografic", label: "Electric / Holografic" },
  { value: "flock", label: "Flock" },
  { value: "glitter", label: "Glitter" },
  { value: "reflectante", label: "Reflectante" },
];

export const RHINESTONES_VARIANTS = [
  { value: "6ss", label: "6SS / 2 mm" },
  { value: "10ss", label: "10SS / 3 mm" },
  { value: "16ss", label: "16SS / 4 mm" },
  { value: "20ss", label: "20SS / 5 mm" },
];

export const PRODUCT_ZONES: Record<ProductType, ProductZone[]> = {
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
    { id: "waist", label: "Cintura", requires: "hasWaistband" },
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

