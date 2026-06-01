"use client";

export default function ColorSelector({ colors, selectedColor, onSelect }) {

  const MAX_COLORS = 10;

  return (
    <section className="flex flex-col gap-4">

      <span className="text-sm font-semibold tracking-wide uppercase opacity-80">Colors</span>
      <div className={colors.length > MAX_COLORS
      ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2 max-h-50 overflow-y-auto border border-black/20 p-2.5 rounded-xl"
      : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2"}>
        {colors.map(color => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className={`px-4 py-2 border-black/4 rounded transition
              ${
                selectedColor === color
                  ? "bg-black/60 text-white"
                  : "bg-zinc-100 hover:bg-zinc-200"
              }
            `}
          >
            {color}
          </button>
        ))}

      </div>
    </section>
  );
}
