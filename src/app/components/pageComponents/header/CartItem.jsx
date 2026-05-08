export default function CartItem({ item, onRemove }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-950">
            {item.productId} - {item.productName}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Color: {item.selectedColor} · {item.totalUnits} uds
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Tallas:{" "}
            {item.sizes?.map((s) => `${s.size} x${s.quantity}`).join(", ")}
          </p>

          {item.customization ? (
            <p className="mt-1 text-xs text-slate-500">
              Personalización: {item.customization.placements.length} elemento(s)
            </p>
          ) : (
            <p className="mt-1 text-xs text-slate-400">Sin personalización</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="shrink-0 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
        >
          Eliminar
        </button>
      </div>

      <div className="mt-4 space-y-1 border-t border-slate-200 pt-3">
        <div className="flex justify-between text-xs text-slate-600">
          <span>Prendas</span>
          <span>{Number(item.garmentBaseTotal || 0).toFixed(2)} €</span>
        </div>

        <div className="flex justify-between text-xs text-slate-600">
          <span>Personalización</span>
          <span>
            {item.customization
              ? `${Number(item.customizationTotal || 0).toFixed(2)} €`
              : "No aplicada"}
          </span>
        </div>

        <div className="mt-2 flex justify-between text-sm font-bold text-slate-950">
          <span>Total</span>
          <span>{Number(item.finalTotal || 0).toFixed(2)} €</span>
        </div>
      </div>
    </div>
  );
}