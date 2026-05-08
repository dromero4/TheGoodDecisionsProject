export default function HelpTooltip() {
  return (
    <div className="group relative inline-flex">
      <button
        type="button"
        aria-label="Ayuda para manipular elementos"
        className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-bold text-slate-500 hover:border-blue-500 hover:text-blue-600"
      >
        ?
      </button>

      <div className="pointer-events-none absolute left-1/2 top-7 z-50 hidden w-72 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-left text-xs text-slate-600 shadow-xl group-hover:block group-focus-within:block">
        <p className="mb-2 font-semibold text-slate-800">
          Cómo editar la personalización
        </p>

        <ul className="space-y-1">
          <li>• Haz clic sobre un elemento para seleccionarlo.</li>
          <li>• Arrástralo para moverlo sobre la prenda.</li>
          <li>• Usa los puntos azules para cambiar el tamaño.</li>
          <li>• Cambia técnica, tamaño y notas desde el panel derecho.</li>
          <li>• Elimina elementos desde el panel izquierdo.</li>
        </ul>
      </div>
    </div>
  );
}