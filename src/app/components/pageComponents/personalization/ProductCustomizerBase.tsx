"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Rnd } from "react-rnd";

type ZoneId = string;

type ElementType = "text" | "image";

type Technique =
  | "embroidery"
  | "screenprint"
  | "dtf"
  | "dtg"
  | "rhinestones"
  | "vinyl";

type EmbroideryType =
  | "matizado"
  | "mixto"
  | "salto_puntada"
  | "bordado_3d";

type ScreenprintType = "plana" | "puff";

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
      sizeLabel: "7x7 cm",
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
      imageUrl: "https://placehold.co/200x200/png",
      embroideryType: "mixto",
      sizeLabel: "7x7 cm",
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
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  isActive
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

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[280px_minmax(420px,1fr)_360px]">
        <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Elementos</h3>
            <p className="text-sm text-slate-500">
              Zona activa:{" "}
              <span className="font-medium">{zoneLabels[activeZone]}</span>
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
                  className={`rounded-lg border p-3 transition ${
                    isSelected
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

        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Preview</h3>
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
                      border: isSelected
                        ? "2px solid #3b82f6"
                        : "1px dashed #94a3b8",
                      background: "rgba(255,255,255,0.82)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      className="flex h-full w-full items-center justify-center p-2 text-center"
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
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="mb-3 text-sm font-semibold text-slate-800">
                  Contenido del elemento
                </p>

                {selectedElement.type === "text" ? (
                  <div className="space-y-4">
                    <Field label="Texto">
                      <input
                        type="text"
                        value={selectedElement.text || ""}
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
                        value={selectedElement.textColor || "#111111"}
                        onChange={(e) =>
                          updateSelectedElement({ textColor: e.target.value })
                        }
                        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-2 py-1"
                      />
                    </Field>

                    <Field label="Tamaño de tipografía">
                      <input
                        type="number"
                        value={selectedElement.fontSize || 24}
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
                        value={selectedElement.name}
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
                      onChange={(e) =>
                        updateSelectedElement({
                          technique: e.target.value as Technique,
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                    >
                      <option value="embroidery">Bordado directo</option>
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
                        onChange={(e) =>
                          updateSelectedElement({
                            embroideryType: e.target.value as EmbroideryType,
                          })
                        }
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

                  <Field label="Tamaño">
                    <input
                      type="text"
                      value={selectedElement.sizeLabel || ""}
                      onChange={(e) =>
                        updateSelectedElement({ sizeLabel: e.target.value })
                      }
                      placeholder="Ej: 7x7 cm"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                    />
                  </Field>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
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
                        value={selectedElement.width}
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
                        value={selectedElement.height}
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
                        value={selectedElement.x}
                        onChange={(e) =>
                          updateSelectedElement({ x: Number(e.target.value) })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </Field>

                    <Field label="Posición Y">
                      <input
                        type="number"
                        value={selectedElement.y}
                        onChange={(e) =>
                          updateSelectedElement({ y: Number(e.target.value) })
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
                      />
                    </Field>
                  </div>

                  <Field label="Notas">
                    <textarea
                      value={selectedElement.notes || ""}
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

function formatTechnique(el: CustomElement) {
  if (el.technique === "embroidery") {
    return `Bordado${
      el.embroideryType ? ` · ${humanEmbroidery(el.embroideryType)}` : ""
    }`;
  }

  if (el.technique === "screenprint") {
    return `Serigrafía${
      el.screenprintType ? ` · ${humanScreenprint(el.screenprintType)}` : ""
    }`;
  }

  if (el.technique === "dtf") return "DTF";
  if (el.technique === "dtg") return "DTG";
  if (el.technique === "rhinestones") return "Pedrería";
  if (el.technique === "vinyl") return "Vinilo";

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