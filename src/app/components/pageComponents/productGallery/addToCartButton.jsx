export default function AddToCartButton({
  canAddToCart,
  onAddToCart,
  cartFeedback,
}) {
  return (
    <>
      <button
        type="button"
        disabled={!canAddToCart}
        onClick={onAddToCart}
        className={`mt-4 w-full rounded-xl px-4 py-3 font-semibold text-white transition ${
          !canAddToCart
            ? "cursor-not-allowed bg-slate-300"
            : "bg-slate-900 hover:bg-slate-800"
        }`}
      >
        Añadir al carrito
      </button>

      {cartFeedback && (
        <div className="animate-slide-in-top fixed left-1/2 top-5 z-[9999] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800 shadow-2xl transition-all">
          {cartFeedback}
        </div>
      )}
    </>
  );
}