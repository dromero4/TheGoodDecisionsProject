export default function SizeSelector({
  sizesForColor,
  sizeQty,
  qtyDraft,
  primarySize,
  getStockForSize,
  selectSize,
  inc,
  dec,
  setQty,
  setQtyDraft,
}) {
  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      {sizesForColor.map((size) => {
        const qty = sizeQty[size] ?? 0;
        const active = primarySize === size;
        const stock = getStockForSize(size);
        const outOfStock = stock <= 0;

        return (
          <div
            key={size}
            onClick={() => {
              if (outOfStock) return;
              selectSize(size);
            }}
            className={[
              "group relative flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all",
              outOfStock
                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                : "cursor-pointer active:scale-[0.98]",
              !outOfStock && qty > 0
                ? "border-black/20 bg-black/2"
                : !outOfStock
                  ? "border-black/10 bg-white hover:bg-black/2"
                  : "",
              active && !outOfStock ? "ring-2 ring-black/30" : "ring-0",
            ].join(" ")}
          >
            <div className="flex flex-col leading-tight">
              <span className="font-medium">{size}</span>
              <span className="text-[10px] text-slate-400">
                {stock > 0 ? `${stock} disp.` : "Sin stock"}
              </span>
            </div>

            {qty > 0 && (
              <div
                className="ml-1 inline-flex items-center overflow-hidden rounded-full border border-black/10 bg-white shadow-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => dec(size)}
                  className="grid h-7 w-7 place-items-center hover:bg-black/4 active:bg-black/6"
                  aria-label={`Decrease ${size}`}
                >
                  <span className="text-base leading-none">−</span>
                </button>

                <input
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="h-7 w-14 text-center text-xs font-semibold tabular-nums outline-none"
                  value={qtyDraft[size] ?? String(qty)}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    setQtyDraft((prev) => ({
                      ...prev,
                      [size]: raw,
                    }));
                  }}
                  onBlur={() => {
                    const raw = qtyDraft[size];
                    const parsed =
                      raw === "" || raw == null ? qty : parseInt(raw, 10);

                    setQty(size, parsed);

                    setQtyDraft((prev) => {
                      const next = { ...prev };
                      delete next[size];
                      return next;
                    });
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();

                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      inc(size);
                    }

                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      dec(size);
                    }
                  }}
                  aria-label={`Quantity for ${size}`}
                />

                <button
                  type="button"
                  onClick={() => inc(size)}
                  className="grid h-7 w-7 place-items-center hover:bg-black/4 active:bg-black/6"
                  aria-label={`Increase ${size}`}
                >
                  <span className="text-base leading-none">+</span>
                </button>
              </div>
            )}

            {qty === 0 && !outOfStock && (
              <span className="text-xs opacity-40 transition group-hover:opacity-70">
                +
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}