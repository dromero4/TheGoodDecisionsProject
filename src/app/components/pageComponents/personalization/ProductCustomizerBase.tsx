"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Rnd } from "react-rnd";

import { calculatePlacementPrice } from "./pricing/calculatePlacementPrice.js";

type ZoneId = string;

type ElementType = "text" | "image";

type Technique =
  | "embroidery"
  | "screenprint"
  | "dtf"
  | "dtg"
  | "rhinestones"
  | "vinyl"
  | "patch";

type EmbroideryType =
  | "matizado"
  | "mixto"
  | "salto_puntada"
  | "bordado_3d";

type ScreenprintType = "plana" | "puff";

const RESIZE_HANDLE_STYLES = {
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

const EMBROIDERY_3D_SIZE_OPTIONS = [
  { value: "3x3", label: "3x3 cm" },
  { value: "5x5", label: "5x5 cm" },
  { value: "7x7", label: "7x7 cm" },
  { value: "10x10", label: "10x10 cm" },
  { value: "15x15", label: "15x15 cm" },
];

const SIZE_OPTIONS_BY_TECHNIQUE: Record<Technique, { value: string; label: string }[]> = {
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

const SIZE_OPTIONS = [
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

const VINYL_VARIANTS = [
  { value: "textil_flex", label: "Textil Flex" },
  { value: "brick_600", label: "Brick 600" },
  { value: "brick_1000", label: "Brick 1000" },
  { value: "electric_holografic", label: "Electric / Holografic" },
  { value: "flock", label: "Flock" },
  { value: "glitter", label: "Glitter" },
  { value: "reflectante", label: "Reflectante" },
];

const RHINESTONES_VARIANTS = [
  { value: "6ss", label: "6SS / 2 mm" },
  { value: "10ss", label: "10SS / 3 mm" },
  { value: "16ss", label: "16SS / 4 mm" },
  { value: "20ss", label: "20SS / 5 mm" },
];

type CustomElement = {
  id: string;
  type: ElementType;
  name: string;

  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;

  technique: Technique;

  text?: string;
  textColor?: string;
  fontSize?: number;

  imageUrl?: string;

  embroideryType?: EmbroideryType;
  screenprintType?: ScreenprintType;
  vinylType?: string;
  rhinestonesType?: string;

  inkCount?: string;

  sizeLabel?: string;
  notes?: string;
};

type ZoneState = {
  elements: CustomElement[];
};

type ProductState = Record<string, ZoneState>;

type ProductFeatureFlags = {
  hasHood?: boolean;
  hasPocket?: boolean;
  hasBackPocket?: boolean;
  hasWaistband?: boolean;
};

type ProductZone = {
  id: string;
  label: string;
  requires?: keyof ProductFeatureFlags;
};

type ProductType = "tshirt" | "hoodie" | "pants" | "cap";

type ProductCustomizerBaseProps = {
  productType?: ProductType;
  productFeatures?: ProductFeatureFlags;
  zoneImages?: Record<string, string | null>;
  category?: string;
  quantity?: number;
  basePriceBreakdown?: {
    size: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  garmentBaseTotal?: number;
  onApplyCustomization?: (payload: any) => void;
};

const PRODUCT_ZONES: Record<ProductType, ProductZone[]> = {
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

function formatMoney(value: number) {
  return `${Number(value || 0).toFixed(2)} €`;
}

function getProductZones(
  productType: ProductType,
  productFeatures: ProductFeatureFlags = {}
) {
  const baseZones = PRODUCT_ZONES[productType] || PRODUCT_ZONES.tshirt;

  return baseZones.filter((zone) => {
    if (!zone.requires) return true;
    return Boolean(productFeatures[zone.requires]);
  });
}

function createEmptyState(zones: ProductZone[]): ProductState {
  return zones.reduce((acc, zone) => {
    acc[zone.id] = { elements: [] };
    return acc;
  }, {} as ProductState);
}

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

function normalizeText(value?: string | null) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function inferProductConfigFromCategory(category?: string | null) {
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

export default function ProductCustomizerBase({
  productType,
  productFeatures,
  zoneImages = {},
  category,
  quantity = 1,
  basePriceBreakdown = [],
  garmentBaseTotal = 0,
  onApplyCustomization
}: ProductCustomizerBaseProps) {
  const inferredConfig = useMemo(() => {
    return inferProductConfigFromCategory(category);
  }, [category]);

  const resolvedProductType = productType ?? inferredConfig.productType;

  const resolvedProductFeatures = useMemo(() => {
    return {
      ...inferredConfig.productFeatures,
      ...(productFeatures || {}),
    };
  }, [inferredConfig, productFeatures]);

  const zones = useMemo(() => {
    return getProductZones(resolvedProductType, resolvedProductFeatures);
  }, [resolvedProductType, resolvedProductFeatures]);

  const zoneLabels = Object.fromEntries(
    zones.map((zone) => [zone.id, zone.label])
  ) as Record<string, string>;

  const [activeZone, setActiveZone] = useState<ZoneId>(zones[0]?.id || "front");
  const [productState, setProductState] = useState<ProductState>(() =>
    createEmptyState(zones)
  );
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);



  useEffect(() => {
    setProductState((prev) => {
      const next = { ...prev };

      zones.forEach((zone) => {
        if (!next[zone.id]) {
          next[zone.id] = { elements: [] };
        }
      });

      return next;
    });

    if (!zones.find((zone) => zone.id === activeZone)) {
      setActiveZone(zones[0]?.id || "front");
      setSelectedElementId(null);
    }
  }, [zones, activeZone]);

  const activeZoneElements = productState[activeZone]?.elements || [];
  const previewImage = zoneImages[activeZone] || null;

  const selectedElement = useMemo(() => {
    return activeZoneElements.find((el) => el.id === selectedElementId) ?? null;
  }, [activeZoneElements, selectedElementId]);

  const selectedElementPricing = useMemo(() => {
    if (!selectedElement) return null;

    return calculatePlacementPrice({
      productType: resolvedProductType,
      view: activeZone,
      technique: selectedElement.technique,
      variant: getTechniqueVariant(selectedElement),
      requestedSize: selectedElement.sizeLabel,
      quantity,
      inkCount: selectedElement.inkCount,
    });
  }, [selectedElement, resolvedProductType, activeZone, quantity]);

  const allPlacementPricings = useMemo(() => {
    return Object.entries(productState).flatMap(([zone, zoneData]) =>
      (zoneData.elements || []).map((element) => {
        const pricing = calculatePlacementPrice({
          productType: resolvedProductType,
          view: zone,
          technique: element.technique,
          variant: getTechniqueVariant(element),
          requestedSize: element.sizeLabel,
          quantity,
          inkCount: element.inkCount,
        });

        return {
          zone,
          element,
          pricing,
        };
      })
    );
  }, [productState, resolvedProductType, quantity]);

  const customizationTotal = useMemo(() => {
    return allPlacementPricings.reduce((sum, item) => {
      if (item.pricing.pricingMode !== "automatic") return sum;
      return sum + Number(item.pricing.totalPrice || 0);
    }, 0);
  }, [allPlacementPricings]);

  const finalTotal = garmentBaseTotal + customizationTotal;

  const hasManualQuote = allPlacementPricings.some(
    (item) => item.pricing.pricingMode === "manual_quote"
  );

  function updateZoneElements(
    zone: ZoneId,
    updater: (elements: CustomElement[]) => CustomElement[]
  ) {
    setProductState((prev) => ({
      ...prev,
      [zone]: {
        ...(prev[zone] || { elements: [] }),
        elements: updater(prev[zone]?.elements || []),
      },
    }));
  }

  function handleSelectedImageUpload(file: File) {
    if (!selectedElementId || !file) return;

    const objectUrl = URL.createObjectURL(file);

    updateSelectedElement({
      imageUrl: objectUrl,
      name: file.name,
    });
  }

  function addTextElement() {
    const newElement: CustomElement = {
      id: createId(),
      type: "text",
      name: `Texto ${activeZoneElements.length + 1}`,
      x: 120,
      y: 120,
      width: 180,
      height: 60,
      rotation: 0,
      technique: "embroidery",
      text: "Tu texto",
      textColor: "#111111",
      fontSize: 24,
      embroideryType: "mixto",
      screenprintType: "plana",
      vinylType: "textil_flex",
      rhinestonesType: "6ss",
      inkCount: "1",
      sizeLabel: "10x10",
      notes: "",
    };

    updateZoneElements(activeZone, (elements) => [...elements, newElement]);
    setSelectedElementId(newElement.id);
  }


  function addImageElement() {
    const newElement: CustomElement = {
      id: createId(),
      type: "image",
      name: `Imagen ${activeZoneElements.length + 1}`,
      x: 140,
      y: 140,
      width: 120,
      height: 120,
      rotation: 0,
      technique: "embroidery",
      imageUrl: "",
      embroideryType: "mixto",
      screenprintType: "plana",
      vinylType: "textil_flex",
      rhinestonesType: "6ss",
      inkCount: "1",
      sizeLabel: "10x10",
      notes: "",
    };

    updateZoneElements(activeZone, (elements) => [...elements, newElement]);
    setSelectedElementId(newElement.id);
  }

  function removeElement(id: string) {
    updateZoneElements(activeZone, (elements) =>
      elements.filter((el) => el.id !== id)
    );

    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }

  function updateSelectedElement(patch: Partial<CustomElement>) {
    if (!selectedElementId) return;

    updateZoneElements(activeZone, (elements) =>
      elements.map((el) =>
        el.id === selectedElementId ? { ...el, ...patch } : el
      )
    );
  }

  function handleChangeZone(zone: ZoneId) {
    setActiveZone(zone);
    setSelectedElementId(null);
  }

  const selectedSizeOptions =
    selectedElement?.technique === "embroidery" &&
      selectedElement?.embroideryType === "bordado_3d"
      ? EMBROIDERY_3D_SIZE_OPTIONS
      : selectedElement
        ? SIZE_OPTIONS_BY_TECHNIQUE[selectedElement.technique] ?? SIZE_OPTIONS
        : SIZE_OPTIONS;

  function handleApplyCustomization() {
    if (allPlacementPricings.length === 0) {
      alert("Añade al menos una personalización antes de aplicar.");
      return;
    }

    const payload = {
      category,
      quantity,
      basePriceBreakdown,
      garmentBaseTotal,
      placements: allPlacementPricings.map((item) => ({
        zone: item.zone,
        zoneLabel: zoneLabels[item.zone] ?? item.zone,
        elementId: item.element.id,
        elementName: item.element.name,
        elementType: item.element.type,
        technique: item.element.technique,
        techniqueLabel: formatTechnique(item.element),
        requestedSize: item.pricing.requestedSize,
        chargedSize: item.pricing.chargedSize,
        quantityBracket: item.pricing.quantityBracket,
        unitPrice: item.pricing.unitPrice,
        totalPrice: item.pricing.totalPrice,
        pricingMode: item.pricing.pricingMode,
        position: {
          x: item.element.x,
          y: item.element.y,
          width: item.element.width,
          height: item.element.height,
          rotation: item.element.rotation,
        },
        notes: item.element.notes ?? "",
      })),
      customizationTotal,
      finalTotal,
      hasManualQuote,
      createdAt: new Date().toISOString(),
    };



    onApplyCustomization?.(payload);
  }

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Configurador base
          </h2>
          <p className="text-sm text-slate-500">
            Base para personalización por zonas. Todo se guarda
            independientemente por cada lado de la prenda.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {zones.map((zone) => {
            const isActive = zone.id === activeZone;
            const count = productState[zone.id]?.elements?.length || 0;

            return (
              <button
                key={zone.id}
                onClick={() => handleChangeZone(zone.id)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${isActive
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {zone.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[280px_minmax(420px,1fr)_360px]">
        <aside className="xl:sticky xl:top-4 xl:self-start rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Elementos</h3>
            <p className="text-sm text-slate-500">
              Zona activa:{" "}
              <span className="font-medium">{zoneLabels[activeZone]}</span>
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Selecciona un elemento, arrástralo y usa los puntos azules para ajustar su tamaño.
            </p>
          </div>

          <div className="mb-4 flex gap-2">
            <button
              onClick={addTextElement}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              + Texto
            </button>
            <button
              onClick={addImageElement}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Imagen
            </button>
          </div>

          <div className="space-y-2">
            {activeZoneElements.length === 0 && (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                No hay elementos en esta zona todavía.
              </div>
            )}

            {activeZoneElements.map((el) => {
              const isSelected = el.id === selectedElementId;

              return (
                <div
                  key={el.id}
                  className={`rounded-lg border p-3 transition ${isSelected
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white"
                    }`}
                >
                  <button
                    onClick={() => setSelectedElementId(el.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{el.name}</p>
                        <p className="text-xs text-slate-500">
                          {el.type === "text" ? "Texto" : "Imagen"} ·{" "}
                          {formatTechnique(el)}
                        </p>
                      </div>
                    </div>
                  </button>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setSelectedElementId(el.id)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => removeElement(el.id)}
                      className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="xl:sticky xl:top-4 xl:self-start rounded-xl border border-slate-200 bg-slate-50 p-4 xl:max-h-[calc(90vh-5rem)]">
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-slate-900">Preview</h3>
              <HelpTooltip />
            </div>
            <p className="text-sm text-slate-500">
              Vista de la zona:{" "}
              <span className="font-medium">{zoneLabels[activeZone]}</span>
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative h-140 w-full max-w-130 overflow-hidden rounded-2xl border border-slate-300 bg-white">
              <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,#f8fafc_0%,#eef2f7_100%)]">
                {previewImage ? (
                  <Image
                    src={previewImage}
                    alt={zoneLabels[activeZone]}
                    fill
                    unoptimized
                    sizes="(max-width: 1280px) 100vw, 520px"
                    className="object-contain"
                    draggable={false}
                  />
                ) : (
                  <div className="text-center">
                    <p className="text-xl font-semibold text-slate-700">
                      Prenda preview
                    </p>
                    <p className="text-sm text-slate-400">
                      {zoneLabels[activeZone]}
                    </p>
                  </div>
                )}
              </div>

              {activeZoneElements.map((el) => {
                const isSelected = el.id === selectedElementId;

                return (
                  <Rnd
                    key={el.id}
                    bounds="parent"
                    size={{ width: el.width, height: el.height }}
                    position={{ x: el.x, y: el.y }}
                    enableResizing={
                      isSelected
                        ? {
                          top: true,
                          right: true,
                          bottom: true,
                          left: true,
                          topRight: true,
                          bottomRight: true,
                          bottomLeft: true,
                          topLeft: true,
                        }
                        : false
                    }
                    resizeHandleStyles={isSelected ? RESIZE_HANDLE_STYLES : {}}
                    onDragStart={() => setSelectedElementId(el.id)}
                    onMouseDown={() => setSelectedElementId(el.id)}
                    onDragStop={(e, d) => {
                      setSelectedElementId(el.id);

                      updateZoneElements(activeZone, (elements) =>
                        elements.map((item) =>
                          item.id === el.id ? { ...item, x: d.x, y: d.y } : item
                        )
                      );
                    }}
                    onResizeStop={(e, direction, ref, delta, position) => {
                      setSelectedElementId(el.id);

                      const newWidth = parseInt(ref.style.width, 10);
                      const newHeight = parseInt(ref.style.height, 10);

                      updateZoneElements(activeZone, (elements) =>
                        elements.map((item) =>
                          item.id === el.id
                            ? {
                              ...item,
                              width: newWidth,
                              height: newHeight,
                              x: position.x,
                              y: position.y,
                            }
                            : item
                        )
                      );
                    }}
                    className={isSelected ? "z-10" : "z-1"}
                    style={{
                      background: "transparent",
                      border: "none",
                      overflow: "visible",
                    }}
                  >
                    <div
                      className={`flex h-full w-full items-center justify-center p-2 text-center ${isSelected ? "ring-2 ring-blue-500/70 ring-offset-2 ring-offset-white" : ""
                        }`}
                      style={{
                        transform: `rotate(${el.rotation}deg)`,
                        transformOrigin: "center center",
                      }}
                    >
                      {el.type === "text" ? (
                        <span
                          style={{
                            color: el.textColor || "#111111",
                            fontSize: `${el.fontSize || 24}px`,
                            lineHeight: 1.1,
                            whiteSpace: "pre-wrap",
                          }}
                          className="wrap-break-word font-semibold"
                        >
                          {el.text ?? "TEXT"}
                        </span>
                      ) : el.imageUrl ? (
                        <Image
                          src={el.imageUrl}
                          alt={el.name}
                          width={el.width || 120}
                          height={el.height || 120}
                          unoptimized
                          className="h-full w-full object-contain"
                          draggable={false}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                          Sin imagen
                        </div>
                      )}
                    </div>
                  </Rnd>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Configuración
            </h3>
            <p className="text-sm text-slate-500">
              Edita el elemento seleccionado
            </p>
          </div>

          {!selectedElement && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
              Selecciona un elemento para editar sus datos.
            </div>
          )}

          {selectedElement && (
            <div
              key={`${selectedElement.id}-${selectedElement.type}`}
              className="space-y-5"
            >
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-3 text-sm font-semibold text-slate-800">
                  Contenido del elemento
                </p>

                {selectedElement.type === "text" ? (
                  <div className="space-y-4">
                    <Field label="Texto">
                      <input
                        type="text"
                        value={selectedElement.text ?? ""}
                        onChange={(e) =>
                          updateSelectedElement({
                            text: e.target.value,
                            name: e.target.value || "Texto",
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </Field>

                    <Field label="Color del texto">
                      <input
                        type="color"
                        value={selectedElement.textColor ?? "#111111"}
                        onChange={(e) =>
                          updateSelectedElement({ textColor: e.target.value })
                        }
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-2 py-1"
                      />
                    </Field>

                    <Field label="Tamaño de tipografía">
                      <input
                        type="number"
                        value={selectedElement.fontSize ?? 24}
                        onChange={(e) =>
                          updateSelectedElement({
                            fontSize: Number(e.target.value),
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </Field>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Field label="Nombre interno">
                      <input
                        type="text"
                        value={selectedElement.name ?? ""}
                        onChange={(e) =>
                          updateSelectedElement({ name: e.target.value })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </Field>

                    <Field label="Subir imagen">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleSelectedImageUpload(file);
                          }
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white"
                      />
                    </Field>

                    {selectedElement.imageUrl && (
                      <p className="text-xs text-slate-500">
                        Imagen cargada: {selectedElement.name}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-3 text-sm font-semibold text-slate-800">
                  Técnica de personalización
                </p>

                <div className="space-y-4">
                  <Field label="Técnica">
                    <select
                      value={selectedElement.technique}
                      onChange={(e) => {
                        const nextTechnique = e.target.value as Technique;
                        const nextSize =
                          SIZE_OPTIONS_BY_TECHNIQUE[nextTechnique]?.[0]?.value ?? "10x10";

                        updateSelectedElement({
                          technique: nextTechnique,
                          sizeLabel: nextSize,
                        });
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                    >
                      <option value="embroidery">Bordado directo</option>
                      <option value="patch">Parche bordado</option>
                      <option value="screenprint">Serigrafía</option>
                      <option value="dtf">DTF</option>
                      <option value="dtg">DTG</option>
                      <option value="rhinestones">Pedrería</option>
                      <option value="vinyl">Vinilo</option>
                    </select>
                  </Field>

                  {selectedElement.technique === "embroidery" && (
                    <Field label="Tipo de bordado">
                      <select
                        value={selectedElement.embroideryType || "mixto"}
                        onChange={(e) => {
                          const nextEmbroideryType = e.target.value as EmbroideryType;

                          updateSelectedElement({
                            embroideryType: nextEmbroideryType,
                            sizeLabel:
                              nextEmbroideryType === "bordado_3d"
                                ? "15x15"
                                : selectedElement.sizeLabel || "10x10",
                          });
                        }}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                      >
                        <option value="matizado">Bordado matizado</option>
                        <option value="mixto">Bordado mixto</option>
                        <option value="salto_puntada">Salto de puntada</option>
                        <option value="bordado_3d">Bordado 3D</option>
                      </select>
                    </Field>
                  )}

                  {selectedElement.technique === "screenprint" && (
                    <Field label="Tipo de serigrafía">
                      <select
                        value={selectedElement.screenprintType || "plana"}
                        onChange={(e) =>
                          updateSelectedElement({
                            screenprintType: e.target.value as ScreenprintType,
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                      >
                        <option value="plana">Plana</option>
                        <option value="puff">Puff</option>
                      </select>
                    </Field>
                  )}

                  {selectedElement.technique === "screenprint" &&
                    selectedElement.screenprintType === "plana" && (
                      <Field label="Número de tintas">
                        <select
                          value={selectedElement.inkCount || "1"}
                          onChange={(e) =>
                            updateSelectedElement({
                              inkCount: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                        >
                          <option value="1">1 tinta</option>
                          <option value="2">2 tintas</option>
                          <option value="3">3 tintas</option>
                          <option value="4">4 tintas</option>
                          <option value="5">+4 tintas / presupuesto manual</option>
                        </select>
                      </Field>
                    )}

                  {selectedElement.technique === "vinyl" && (
                    <Field label="Tipo de vinilo">
                      <select
                        value={selectedElement.vinylType || "textil_flex"}
                        onChange={(e) =>
                          updateSelectedElement({
                            vinylType: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                      >
                        {VINYL_VARIANTS.map((variant) => (
                          <option key={variant.value} value={variant.value}>
                            {variant.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}

                  {selectedElement.technique === "rhinestones" && (
                    <Field label="Tipo de pedrería">
                      <select
                        value={selectedElement.rhinestonesType || "6ss"}
                        onChange={(e) =>
                          updateSelectedElement({
                            rhinestonesType: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                      >
                        {RHINESTONES_VARIANTS.map((variant) => (
                          <option key={variant.value} value={variant.value}>
                            {variant.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}

                  <Field label="Tamaño">
                    <select
                      value={selectedElement.sizeLabel ?? selectedSizeOptions[0]?.value ?? ""}
                      onChange={(e) =>
                        updateSelectedElement({ sizeLabel: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                    >
                      {selectedSizeOptions.map((size) => (
                        <option key={size.value} value={size.value}>
                          {size.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>
              {/* <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-3 text-sm font-semibold text-slate-800">
                  Transformación visual
                </p>

                <div className="space-y-4">
                  <Field label={`Rotación: ${selectedElement.rotation}°`}>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="1"
                      value={selectedElement.rotation}
                      onChange={(e) =>
                        updateSelectedElement({
                          rotation: Number(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Ancho">
                      <input
                        type="number"
                        value={selectedElement.width ?? 0}
                        onChange={(e) =>
                          updateSelectedElement({
                            width: Number(e.target.value),
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </Field>

                    <Field label="Alto">
                      <input
                        type="number"
                        value={selectedElement.height ?? 0}
                        onChange={(e) =>
                          updateSelectedElement({
                            height: Number(e.target.value),
                          })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </Field>
                  </div>
                </div>
              </div> */}

              {selectedElementPricing && (
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="mb-3 text-sm font-semibold text-slate-800">
                    Precio de esta personalización
                  </p>

                  {selectedElementPricing.pricingMode === "automatic" ? (
                    <div className="space-y-1 text-sm text-slate-600">
                      <p>
                        Tamaño solicitado:{" "}
                        <span className="font-medium">
                          {selectedElementPricing.requestedSize}
                        </span>
                      </p>

                      <p>
                        Tamaño cobrado:{" "}
                        <span className="font-medium">
                          {selectedElementPricing.chargedSize}
                        </span>
                      </p>



                      {selectedElementPricing.inkCount && (
                        <p>
                          Tintas:{" "}
                          <span className="font-medium">
                            {selectedElementPricing.inkCount}
                          </span>
                        </p>
                      )}

                      <p>
                        Precio unitario:{" "}
                        <span className="font-medium">
                          {Number(selectedElementPricing.unitPrice).toFixed(2)} €
                        </span>
                      </p>

                      <p>
                        Total:{" "}
                        <span className="font-semibold text-slate-900">
                          {Number(selectedElementPricing.totalPrice).toFixed(2)} €
                        </span>
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                      <p className="font-medium">Presupuesto manual</p>
                      <p className="mt-1">
                        Motivo: {selectedElementPricing.reason || "No disponible"}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-3 text-sm font-semibold text-slate-800">
                  Resumen final
                </p>

                <div className="space-y-3 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="font-semibold text-slate-800">Prendas base</p>

                    {basePriceBreakdown.length > 0 ? (
                      <div className="mt-2 space-y-1 text-slate-600">
                        {basePriceBreakdown.map((item) => (
                          <div
                            key={item.size}
                            className="flex justify-between gap-3"
                          >
                            <span>
                              Talla {item.size}: {item.quantity} uds ×{" "}
                              {formatMoney(item.unitPrice)}
                            </span>
                            <span className="font-medium">
                              {formatMoney(item.total)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-slate-500">
                        No hay prendas seleccionadas.
                      </p>
                    )}

                    <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 font-semibold">
                      <span>Total prendas</span>
                      <span>{formatMoney(garmentBaseTotal)}</span>
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="font-semibold text-slate-800">Personalizaciones</p>

                    {allPlacementPricings.length > 0 ? (
                      <div className="mt-2 space-y-2 text-slate-600 max-h-75 overflow-auto">
                        {allPlacementPricings.map((item) => {
                          const isAutomatic = item.pricing.pricingMode === "automatic";

                          return (
                            <div
                              key={`${item.zone}-${item.element.id}`}
                              className="rounded-md border border-slate-200 bg-white p-2"
                            >
                              <div className="flex justify-between gap-3">
                                <span>
                                  {zoneLabels[item.zone] ?? item.zone} ·{" "}
                                  {formatTechnique(item.element)}
                                </span>

                                <span className="font-medium">
                                  {isAutomatic
                                    ? formatMoney(Number(item.pricing.totalPrice || 0))
                                    : "Manual"}
                                </span>
                              </div>

                              <p className="mt-1 text-xs text-slate-500">
                                Tamaño: {item.pricing.requestedSize} →{" "}
                                {item.pricing.chargedSize || "—"} · Tramo:{" "}
                                {item.pricing.quantityBracket || "—"} uds
                              </p>

                              {!isAutomatic && (
                                <p className="mt-1 text-xs text-amber-700">
                                  Requiere presupuesto manual: {item.pricing.reason}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-2 text-slate-500">
                        No hay personalizaciones añadidas.
                      </p>
                    )}

                    <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 font-semibold">
                      <span>Total personalización</span>
                      <span>{formatMoney(customizationTotal)}</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-slate-900 p-4 text-white">
                    <div className="flex justify-between text-base font-bold">
                      <span>Total estimado</span>
                      <span>{formatMoney(finalTotal)}</span>
                    </div>

                    {hasManualQuote && (
                      <p className="mt-2 text-xs text-slate-300">
                        Hay personalizaciones que requieren presupuesto manual. El total final
                        puede variar.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyCustomization}
                  className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99]"
                >
                  Aplicar personalización
                </button>
              </div>


              <details className="rounded-xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer text-sm font-semibold text-slate-800">
                  Ajustes avanzados
                </summary>

                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Posición X">
                      <input
                        type="number"
                        value={selectedElement.x ?? 0}
                        onChange={(e) =>
                          updateSelectedElement({ x: Number(e.target.value) })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </Field>

                    <Field label="Posición Y">
                      <input
                        type="number"
                        value={selectedElement.y ?? 0}
                        onChange={(e) =>
                          updateSelectedElement({ y: Number(e.target.value) })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </Field>
                  </div>

                  <Field label="Notas">
                    <textarea
                      value={selectedElement.notes ?? ""}
                      onChange={(e) =>
                        updateSelectedElement({ notes: e.target.value })
                      }
                      rows={4}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                    />
                  </Field>
                </div>
              </details>
            </div>
          )}
        </aside>
      </div>
    </div>
  );

}

function HelpTooltip() {
  return (
    <div className="group relative inline-flex">
      <button
        type="button"
        aria-label="Ayuda para manipular elementos"
        className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-500 hover:border-blue-500 hover:text-blue-600"
      >
        ?
      </button>

      <div className="pointer-events-none absolute left-1/2 top-7 z-50 hidden w-72 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-left text-xs text-slate-600 shadow-xl group-hover:block group-focus-within:block">
        <p className="mb-2 font-semibold text-slate-800">
          Cómo editar la personalización
        </p>

        <ul className="space-y-1">
          <li>• Haz clic sobre un elemento para seleccionarlo.</li>
          <li>• Arrástralo para moverlo sobre la prenda.</li>
          <li>• Usa los puntos azules para cambiar el tamaño.</li>
          <li>• Cambia técnica, tamaño y notas desde el panel derecho.</li>
          <li>• Elimina elementos desde el panel izquierdo.</li>
        </ul>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function getTechniqueVariant(element: CustomElement) {
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

function formatTechnique(el: CustomElement) {
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

function humanEmbroidery(type: EmbroideryType) {
  if (type === "matizado") return "Matizado";
  if (type === "mixto") return "Mixto";
  if (type === "salto_puntada") return "Salto de puntada";
  if (type === "bordado_3d") return "3D";
  return type;
}

function humanScreenprint(type: ScreenprintType) {
  if (type === "plana") return "Plana";
  if (type === "puff") return "Puff";
  return type;
}

function humanVinyl(type: string) {
  if (type === "textil_flex") return "Textil Flex";
  if (type === "brick_600") return "Brick 600";
  if (type === "brick_1000") return "Brick 1000";
  if (type === "electric_holografic") return "Electric / Holografic";
  if (type === "flock") return "Flock";
  if (type === "glitter") return "Glitter";
  if (type === "reflectante") return "Reflectante";
  return type;
}

function humanRhinestones(type: string) {
  if (type === "6ss") return "6SS / 2 mm";
  if (type === "10ss") return "10SS / 3 mm";
  if (type === "16ss") return "16SS / 4 mm";
  if (type === "20ss") return "20SS / 5 mm";
  return type;
}