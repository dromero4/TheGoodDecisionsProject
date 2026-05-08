export default function ProductNotice({ totalUnits }) {
  if (totalUnits >= 10) return null;

  return (
    <p className="mt-2 text-sm text-slate-500 underline">
      Selecciona al menos 10 unidades para añadir el producto al carrito.
    </p>
  );
}