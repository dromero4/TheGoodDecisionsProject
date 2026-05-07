"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CheckoutCancelPage() {
  const [stripeUrl, setStripeUrl] = useState(null);

  useEffect(() => {
    const savedStripeUrl = sessionStorage.getItem("lastStripeCheckoutUrl");
    setStripeUrl(savedStripeUrl);
  }, []);

  function handleReturnToPayment() {
    if (!stripeUrl) return;
    window.location.href = stripeUrl;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <section className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
          !
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
          Pago cancelado
        </p>

        <h1 className="text-3xl font-bold text-slate-950">
          Tu pago no se ha completado
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
          Has cancelado el proceso de pago antes de finalizarlo. No se ha
          realizado ningún cargo y puedes volver directamente a la pasarela de
          Stripe sin tener que configurar el pedido otra vez.
        </p>

        <div className="mt-8 w-full rounded-2xl bg-slate-50 p-5 text-left">
          <p className="text-sm font-semibold text-slate-900">
            ¿Qué puedes hacer ahora?
          </p>

          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• Volver al pago y completar la compra.</li>
            <li>• Volver a la tienda para revisar el pedido.</li>
            <li>• Continuar comprando otros productos.</li>
          </ul>
        </div>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          {stripeUrl && (
            <button
              type="button"
              onClick={handleReturnToPayment}
              className="flex-1 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Volver al pago
            </button>
          )}

          <Link
            href="/"
            className="flex-1 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Volver a la tienda
          </Link>
        </div>
      </section>
    </main>
  );
}