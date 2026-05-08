"use client";

import { useEffect, useMemo, useState } from "react";

import { calculatePlacementPrice } from "../pricing/calculatePlacementPrice.js";

import type {
  ZoneId,
  CustomElement,
  ProductState,
  ProductCustomizerBaseProps,
} from "./customizerTypes";

import {
  EMBROIDERY_3D_SIZE_OPTIONS,
  SIZE_OPTIONS_BY_TECHNIQUE,
  SIZE_OPTIONS,
} from "./customizerConstants";

import {
  getProductZones,
  createEmptyState,
  createId,
  inferProductConfigFromCategory,
  getTechniqueVariant,
  formatTechnique,
} from "./customizerHelpers";

import ElementListPanel from "./ElementListPanel";
import PreviewPanel from "./PreviewPanel";

import ElementContentSettings from "./ElementContentSettings";
import TechniqueSettings from "./TechniqueSettings";

import SelectedElementPricingCard from "./SelectedElementPricingCard";
import CustomizationSummary from "./CustomizationSummary";
import AdvancedElementSettings from "./AdvancedElementSettings";

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

              <SelectedElementPricingCard
                selectedElementPricing={selectedElementPricing}
              />

              <CustomizationSummary
                basePriceBreakdown={basePriceBreakdown}
                garmentBaseTotal={garmentBaseTotal}
                allPlacementPricings={allPlacementPricings}
                zoneLabels={zoneLabels}
                customizationTotal={customizationTotal}
                finalTotal={finalTotal}
                hasManualQuote={hasManualQuote}
                onApplyCustomization={handleApplyCustomization}
              />


              <AdvancedElementSettings
                selectedElement={selectedElement}
                onUpdateElement={updateSelectedElement}
              />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}