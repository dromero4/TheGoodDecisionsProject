export default function BulkDiscountTable({
  tiers,
  primarySize,
  selectedSizes,
}) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide opacity-80 sm:text-sm">
          Descuento por volumen
        </span>

        {primarySize && selectedSizes.length > 1 && (
          <span className="text-[11px] text-black/50 sm:text-xs">
            Mostrando niveles para: <strong>{primarySize}</strong>
          </span>
        )}
      </div>

      <div className="w-full overflow-hidden rounded-xl border border-black/10 bg-white sm:rounded-2xl">
        <table className="w-full table-fixed cursor-default text-xs sm:text-sm">
          <thead className="bg-black/3">
            <tr>
              <th className="w-1/2 px-2 py-2 text-left font-semibold text-black/70 sm:px-4 sm:py-3">
                Cantidad
              </th>
              <th className="w-1/2 px-2 py-2 text-right font-semibold text-black/70 sm:px-4 sm:py-3">
                Precio
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/10">
            {tiers.length ? (
              tiers.map((tier) => (
                <tr
                  key={tier.label}
                  className="transition-colors hover:bg-black/2"
                >
                  <th className="px-2 py-2 text-left font-medium sm:px-4 sm:py-3">
                    {tier.label}
                  </th>
                  <td className="px-2 py-2 text-right sm:px-4 sm:py-3">
                    {tier.price} €
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-2 py-3 text-xs text-black/50 sm:px-4 sm:py-4 sm:text-sm" colSpan={2}>
                  Selecciona un color y talla para ver los precios por volumen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-[11px] leading-snug text-black/50 sm:text-xs">
        Precios mostrados por unidad. El precio final depende de la variante y
        su disponibilidad.
      </p>
    </section>
  );
}