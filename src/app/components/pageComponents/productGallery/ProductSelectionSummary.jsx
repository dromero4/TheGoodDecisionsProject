export default function ProductSelectionSummary({
  totalUnits,
  primarySize,
  onClear,
}) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-sm opacity-70">
        {totalUnits > 9 ? (
          <>
            Total: <strong>{totalUnits}</strong> unidad(es)
            {primarySize && (
              <>
                {" "}
                · Talla principal: <strong>{primarySize}</strong>
              </>
            )}
          </>
        ) : (
          "El mínimo necesario para proceder con el pedido es 10."
        )}
      </div>

      {totalUnits > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-black/10 px-3 py-1.5 text-xs transition hover:bg-black/3"
        >
          Limpiar selección
        </button>
      )}
    </div>
  );
}