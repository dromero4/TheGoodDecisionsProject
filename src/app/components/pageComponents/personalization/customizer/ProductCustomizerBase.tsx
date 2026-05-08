"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Rnd } from "react-rnd";

import { calculatePlacementPrice } from "../pricing/calculatePlacementPrice.js";

import type {
  ZoneId,
  Technique,
  EmbroideryType,
  ScreenprintType,
  CustomElement,
  ProductState,
  ProductCustomizerBaseProps,
} from "./customizerTypes";

import {
  RESIZE_HANDLE_STYLES,
  EMBROIDERY_3D_SIZE_OPTIONS,
  SIZE_OPTIONS_BY_TECHNIQUE,
  SIZE_OPTIONS,
  VINYL_VARIANTS,
  RHINESTONES_VARIANTS,
} from "./customizerConstants";

import {
  formatMoney,
  getProductZones,
  createEmptyState,
  createId,
  inferProductConfigFromCategory,
  getTechniqueVariant,
  formatTechnique,
} from "./customizerHelpers";

import Field from "./Field";
import HelpTooltip from "./HelpTooltip.jsx";

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






