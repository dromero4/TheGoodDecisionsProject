export default function BulkDiscountTable({
  tiers,
  primarySize,
  selectedSizes,
}) {
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold uppercase tracking-wide opacity-80">
          Descuento por volumen
        </span>

        {primarySize && selectedSizes.length > 1 && (
          <span className="text-xs text-black/50">
            Mostrando niveles para: <strong>{primarySize}</strong>
          </span>
        )}
      </div>

      <div className="relative overflow-x-auto rounded-2xl border border-black/10 bg-white">
        <table className="w-full cursor-default text-sm">
          <thead className="bg-black/3">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-black/70">
                Cantidad
              </th>
              <th className="px-4 py-3 text-right font-semibold text-black/70">
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
                  <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    {tier.label}
                  </th>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {tier.price} €
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 text-sm text-black/50" colSpan={2}>
                  Selecciona un color y talla para ver los precios por volumen.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-2 text-xs text-black/50">
        Precios mostrados por unidad. El precio final depende de la variante y
        su disponibilidad.
      </p>
    </section>
  );
}