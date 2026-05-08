import type { CustomElement, ProductZone, ZoneId } from "./customizerTypes";
import { formatTechnique } from "./customizerHelpers";

type ElementListPanelProps = {
  activeZone: ZoneId;
  zoneLabels: Record<string, string>;
  activeZoneElements: CustomElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onRemoveElement: (id: string) => void;
  onAddTextElement: () => void;
  onAddImageElement: () => void;
};

export default function ElementListPanel({
  activeZone,
  zoneLabels,
  activeZoneElements,
  selectedElementId,
  onSelectElement,
  onRemoveElement,
  onAddTextElement,
  onAddImageElement,
}: ElementListPanelProps) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4 xl:sticky xl:top-4 xl:self-start">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Elementos</h3>

        <p className="text-sm text-slate-500">
          Zona activa:{" "}
          <span className="font-medium">{zoneLabels[activeZone]}</span>
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Selecciona un elemento, arrástralo y usa los puntos azules para ajustar su tamaño.
        </p>
      </div>

      

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={onAddTextElement}
          className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Texto
        </button>

        <button
          type="button"
          onClick={onAddImageElement}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Imagen
        </button>
      </div>

      <div className="space-y-2">
        {activeZoneElements.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
            No hay elementos en esta zona todavía.
          </div>
        )}

        {activeZoneElements.map((element) => {
          const isSelected = element.id === selectedElementId;

          return (
            <div
              key={element.id}
              className={`rounded-lg border p-3 transition ${
                isSelected
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectElement(element.id)}
                className="w-full text-left"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      {element.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {element.type === "text" ? "Texto" : "Imagen"} ·{" "}
                      {formatTechnique(element)}
                    </p>
                  </div>
                </div>
              </button>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => onSelectElement(element.id)}
                  className="rounded-md border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveElement(element.id)}
                  className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}