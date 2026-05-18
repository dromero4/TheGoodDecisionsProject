import type { CustomElement } from "./customizerTypes";
import { formatMoney, formatTechnique } from "./customizerHelpers";
import { useState } from "react";



type CustomizationSummaryProps = {
  basePriceBreakdown: {
    size: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  garmentBaseTotal: number;
  allPlacementPricings: {
    zone: string;
    element: CustomElement;
    pricing: any;
  }[];
  zoneLabels: Record<string, string>;
  customizationTotal: number;
  finalTotal: number;
  hasManualQuote: boolean;
  onApplyCustomization: () => void;
  onSaveDesign?: (name: string) => void;
};

export default function CustomizationSummary({
  basePriceBreakdown,
  garmentBaseTotal,
  allPlacementPricings,
  zoneLabels,
  customizationTotal,
  finalTotal,
  hasManualQuote,
  onApplyCustomization,
  onSaveDesign,
}: CustomizationSummaryProps) {
  const [designName, setDesignName] = useState("");

  return (
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
                <div key={item.size} className="flex justify-between gap-3">
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
            <div className="mt-2 max-h-75 space-y-2 overflow-auto text-slate-600">
              {allPlacementPricings.map((item) => {
                const isAutomatic =
                  item.pricing.pricingMode === "automatic";

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
              Hay personalizaciones que requieren presupuesto manual. El total
              final puede variar.
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onApplyCustomization}
        className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99] hover:cursor-pointer"
      >
        Aplicar personalización
      </button>

      <hr  className="my-5 opacity-10"/>

      <div className="max-w-100">
        <input
          type="text"
          placeholder="Introduce el nombre de tu diseño"
          className="border border-slate-950 bg-slate-200 py-2 px-1 mt-1 rounded-xl w-full" 
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
        />
        <button
          type="button"
          onClick={() => onSaveDesign(designName)}
          className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.99] hover:cursor-pointer"
        >
          Guardar diseño
        </button>
      </div>
    </div>
  );
}