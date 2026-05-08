import Field from "./Field";
import type { CustomElement } from "./customizerTypes";

type AdvancedElementSettingsProps = {
  selectedElement: CustomElement;
  onUpdateElement: (patch: Partial<CustomElement>) => void;
};

export default function AdvancedElementSettings({
  selectedElement,
  onUpdateElement,
}: AdvancedElementSettingsProps) {
  return (
    <details className="rounded-xl border border-slate-200 bg-white p-4">
      <summary className="cursor-pointer text-sm font-semibold text-slate-800">
        Ajustes avanzados
      </summary>

      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Posición X">
            <input
              type="number"
              value={selectedElement.x ?? 0}
              onChange={(e) =>
                onUpdateElement({
                  x: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
            />
          </Field>

          <Field label="Posición Y">
            <input
              type="number"
              value={selectedElement.y ?? 0}
              onChange={(e) =>
                onUpdateElement({
                  y: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
            />
          </Field>
        </div>

        <Field label="Notas">
          <textarea
            value={selectedElement.notes ?? ""}
            onChange={(e) =>
              onUpdateElement({
                notes: e.target.value,
              })
            }
            rows={4}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
          />
        </Field>
      </div>
    </details>
  );
}