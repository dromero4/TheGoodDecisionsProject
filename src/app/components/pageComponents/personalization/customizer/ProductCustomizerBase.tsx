"use client";

import { useEffect, useMemo, useState } from "react";

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

import ElementListPanel from "./ElementListPanel";
import PreviewPanel from "./PreviewPanel";

import ElementContentSettings from "./ElementContentSettings";
import TechniqueSettings from "./TechniqueSettings";

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
        <ElementListPanel
          activeZone={activeZone}
          zoneLabels={zoneLabels}
          activeZoneElements={activeZoneElements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onRemoveElement={removeElement}
          onAddTextElement={addTextElement}
          onAddImageElement={addImageElement}
        />

        <PreviewPanel
          activeZone={activeZone}
          activeZoneElements={activeZoneElements}
          selectedElementId={selectedElementId}
          previewImage={previewImage}
          zoneLabels={zoneLabels}
          onSelectElement={setSelectedElementId}
          onUpdateZoneElements={updateZoneElements}
        />

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
              <ElementContentSettings
                selectedElement={selectedElement}
                onUpdateElement={updateSelectedElement}
                onImageUpload={handleSelectedImageUpload}
              />

              <TechniqueSettings
                selectedElement={selectedElement}
                selectedSizeOptions={selectedSizeOptions}
                onUpdateElement={updateSelectedElement}
              />

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






