import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <section className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-green-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-600">
          Pago confirmado
        </p>

        <h1 className="text-3xl font-bold text-slate-950">
          Tu pedido ha sido confirmado.
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
          El pago fue completado con éxito. 
          Hemos recibido la información de tu pedido y los detalles de producción 
          vinculados a tu producto personalizado.
        </p>

        <div className="mt-8 w-full rounded-2xl bg-slate-50 p-5 text-left">
          <p className="text-sm font-semibold text-slate-900">
            ¿Qué sucede a continuación?
          </p>

          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• Se ha generado el resumen del pedido.</li>
            <li>• Se incluyen las cantidades de productos y los detalles de personalización.</li>
          </ul>
        </div>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex-1 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Volver a la tienda
          </Link>

          <Link
            href="/"
            className="flex-1 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Continuar comprando
          </Link>
        </div>
      </section>
    </main>
  );
}