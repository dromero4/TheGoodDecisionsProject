import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <section className="mx-auto flex max-w-2xl flex-col items-center rounded-3xl border border-green-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
          ✓
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-green-600">
          Payment completed
        </p>

        <h1 className="text-3xl font-bold text-slate-950">
          Your order has been confirmed
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600">
          The payment was completed successfully in test mode. We have received
          your order information and the production details linked to your
          customized product.
        </p>

        <div className="mt-8 w-full rounded-2xl bg-slate-50 p-5 text-left">
          <p className="text-sm font-semibold text-slate-900">
            What happens next?
          </p>

          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• The order summary has been generated.</li>
            <li>• Product quantities and customization details are included.</li>
            <li>• In a real environment, this step would trigger order processing.</li>
          </ul>
        </div>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex-1 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Back to store
          </Link>

          <Link
            href="/"
            className="flex-1 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Continue shopping
          </Link>
        </div>
      </section>
    </main>
  );
}