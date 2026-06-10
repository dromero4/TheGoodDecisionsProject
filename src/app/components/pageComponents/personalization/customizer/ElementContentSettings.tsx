import Field from "./Field";
import type { CustomElement } from "./customizerTypes";

type ElementContentSettingsProps = {
  selectedElement: CustomElement;
  onUpdateElement: (patch: Partial<CustomElement>) => void;
  onImageUpload: (file: File) => void;
};

export default function ElementContentSettings({
  selectedElement,
  onUpdateElement,
  onImageUpload,
}: ElementContentSettingsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-slate-800">
        Contenido del elemento
      </p>

      {selectedElement.type === "text" ? (
        <div className="space-y-4">
          <Field label="Texto">
            <input
              type="text"
              value={selectedElement.text ?? ""}
              onChange={(e) =>
                onUpdateElement({
                  text: e.target.value,
                  name: e.target.value || "Texto",
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
            />
          </Field>

          <Field label="Color del texto">
            <input
              type="color"
              value={selectedElement.textColor ?? "#111111"}
              onChange={(e) =>
                onUpdateElement({
                  textColor: e.target.value,
                })
              }
              className="h-11 w-full rounded-lg border border-slate-300 bg-white px-2 py-1"
            />
          </Field>

          {/* <Field label="Tamaño de tipografía">
            <input
              type="number"
              value={selectedElement.fontSize ?? 24}
              onChange={(e) =>
                onUpdateElement({
                  fontSize: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
            />
          </Field> */}
        </div>
      ) : (
        <div className="space-y-4">
          <Field label="Nombre interno">
            <input
              type="text"
              value={selectedElement.name ?? ""}
              onChange={(e) =>
                onUpdateElement({
                  name: e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
            />
          </Field>

          <Field label="Subir imagen">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  onImageUpload(file);
                }
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white"
            />
          </Field>

          {selectedElement.imageUrl && (
            <p className="text-xs text-slate-500">
              Imagen cargada: {selectedElement.name}
            </p>
          )}
        </div>
      )}
    </div>
  );
}