export default function SelectedSizesSummary({ totalUnits, sizeSummary }) {
  if (totalUnits <= 0 || sizeSummary.length === 0) return null;

  return (
    <div className="mt-5 flex flex-wrap gap-2 text-xs">
      {sizeSummary.map(([size, qty]) => (
        <span
          key={size}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-2.5 py-1"
        >
          <span className="font-semibold">{size}</span>
          <span className="tabular-nums font-semibold">{qty}</span>
        </span>
      ))}
    </div>
  );
}