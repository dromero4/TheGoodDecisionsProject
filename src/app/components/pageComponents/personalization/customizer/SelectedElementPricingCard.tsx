type SelectedElementPricingCardProps = {
  selectedElementPricing: any;
};

export default function SelectedElementPricingCard({
  selectedElementPricing,
}: SelectedElementPricingCardProps) {
  if (!selectedElementPricing) return null;

  return (
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
  );
}