// src/app/components/pageComponents/personalization/availability/techniqueCatalog.js

export const TECHNIQUES = {
  EMBROIDERY: "embroidery",
  PATCH: "patch",
  DTF: "dtf",
  DTG: "dtg",
  SCREENPRINT: "screenprint",
  VINYL: "vinyl",
  RHINESTONE: "rhinestone",
  LABEL: "label",
};

export const TECHNIQUE_LABELS = {
  [TECHNIQUES.EMBROIDERY]: "Bordado directo",
  [TECHNIQUES.PATCH]: "Parche bordado termoadhesivo",
  [TECHNIQUES.DTF]: "DTF",
  [TECHNIQUES.DTG]: "DTG",
  [TECHNIQUES.SCREENPRINT]: "Serigrafía",
  [TECHNIQUES.VINYL]: "Vinilo",
  [TECHNIQUES.RHINESTONE]: "Pedrería",
  [TECHNIQUES.LABEL]: "Etiqueta",
};

export const TECHNIQUE_VARIANTS = {
  [TECHNIQUES.EMBROIDERY]: [
    { key: "matizado", label: "Bordado matizado" },
    { key: "mixto", label: "Bordado mixto" },
    { key: "salto_puntada", label: "Salto de puntada" },
    { key: "3d", label: "Bordado 3D" },
  ],

  [TECHNIQUES.PATCH]: [
    { key: "salto_puntada", label: "Bordado con salto de puntada" },
    { key: "mixto", label: "Bordado mixto" },
    { key: "matizado", label: "Bordado matizado" },
    { key: "3d", label: "Bordado 3D" },
    { key: "espiga", label: "Bordado punto de espiga" },
    { key: "cruz", label: "Bordado punto de cruz" },
    { key: "floral", label: "Bordado efecto floral" },
    { key: "cadeneta", label: "Bordado cadeneta" },
    { key: "lentejuelas", label: "Bordado lentejuelas" },
    { key: "rizo", label: "Bordado rizo" },
  ],

  [TECHNIQUES.DTF]: [],

  [TECHNIQUES.DTG]: [],

  [TECHNIQUES.SCREENPRINT]: [
    { key: "plana", label: "Serigrafía plana" },
    { key: "puff", label: "Serigrafía puff" },
    { key: "otras_tintas", label: "Serigrafía otras tintas o acabados" },
  ],

  [TECHNIQUES.VINYL]: [
    { key: "flexy", label: "Vinilo flexy" },
    { key: "glitter", label: "Vinilo glitter" },
    { key: "electrico", label: "Vinilo eléctrico" },
    { key: "holografico", label: "Vinilo holográfico" },
    { key: "brick_1000", label: "Vinilo brick 1000" },
    { key: "brick_600", label: "Vinilo brick 600" },
    { key: "flock", label: "Vinilo flock" },
    { key: "reflectante", label: "Vinilo reflectante" },
  ],

  [TECHNIQUES.RHINESTONE]: [],

  [TECHNIQUES.LABEL]: [
    { key: "dtf", label: "Etiqueta DTF" },
    { key: "estampada", label: "Etiqueta estampada" },
    { key: "tejida", label: "Etiqueta tejida" },
  ],
};

export function getTechniqueVariants(technique) {
  return TECHNIQUE_VARIANTS[technique] || [];
}

export function techniqueHasVariants(technique) {
  return getTechniqueVariants(technique).length > 0;
}