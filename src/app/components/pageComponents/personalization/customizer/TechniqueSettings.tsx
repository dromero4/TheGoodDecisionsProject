import Field from "./Field";
import {
  EMBROIDERY_3D_SIZE_OPTIONS,
  RHINESTONES_VARIANTS,
  SIZE_OPTIONS,
  SIZE_OPTIONS_BY_TECHNIQUE,
  VINYL_VARIANTS,
} from "./customizerConstants";
import type {
  CustomElement,
  EmbroideryType,
  ScreenprintType,
  Technique,
} from "./customizerTypes";

type TechniqueSettingsProps = {
  selectedElement: CustomElement;
  selectedSizeOptions: { value: string; label: string }[];
  onUpdateElement: (patch: Partial<CustomElement>) => void;
};

export default function TechniqueSettings({
  selectedElement,
  selectedSizeOptions,
  onUpdateElement,
}: TechniqueSettingsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="mb-3 text-sm font-semibold text-slate-800">
        Técnica de personalización
      </p>

      <div className="space-y-4">
        <Field label="Técnica">
          <select
            value={selectedElement.technique}
            onChange={(e) => {
              const nextTechnique = e.target.value as Technique;
              const nextSize =
                SIZE_OPTIONS_BY_TECHNIQUE[nextTechnique]?.[0]?.value ??
                "10x10";

              onUpdateElement({
                technique: nextTechnique,
                sizeLabel: nextSize,
              });
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="embroidery">Bordado directo</option>
            <option value="patch">Parche bordado</option>
            <option value="screenprint">Serigrafía</option>
            <option value="dtf">DTF</option>
            <option value="dtg">DTG</option>
            <option value="rhinestones">Pedrería</option>
            <option value="vinyl">Vinilo</option>
          </select>
        </Field>

        {selectedElement.technique === "embroidery" && (
          <Field label="Tipo de bordado">
            <select
              value={selectedElement.embroideryType || "mixto"}
              onChange={(e) => {
                const nextEmbroideryType = e.target.value as EmbroideryType;

                onUpdateElement({
                  embroideryType: nextEmbroideryType,
                  sizeLabel:
                    nextEmbroideryType === "bordado_3d"
                      ? "15x15"
                      : selectedElement.sizeLabel || "10x10",
                });
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="matizado">Bordado matizado</option>
              <option value="mixto">Bordado mixto</option>
              <option value="salto_puntada">Salto de puntada</option>
              <option value="bordado_3d">Bordado 3D</option>
            </select>
          </Field>
        )}

        {selectedElement.technique === "screenprint" && (
          <Field label="Tipo de serigrafía">
            <select
              value={selectedElement.screenprintType || "plana"}
              onChange={(e) =>
                onUpdateElement({
                  screenprintType: e.target.value as ScreenprintType,
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="plana">Plana</option>
              <option value="puff">Puff</option>
            </select>
          </Field>
        )}

        {selectedElement.technique === "screenprint" &&
          selectedElement.screenprintType === "plana" && (
            <Field label="Número de tintas">
              <select
                value={selectedElement.inkCount || "1"}
                onChange={(e) =>
                  onUpdateElement({
                    inkCount: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
              >
                <option value="1">1 tinta</option>
                <option value="2">2 tintas</option>
                <option value="3">3 tintas</option>
                <option value="4">4 tintas</option>
                <option value="5">+4 tintas / presupuesto manual</option>
              </select>
            </Field>
          )}

        {selectedElement.technique === "vinyl" && (
          <Field label="Tipo de vinilo">
            <select
              value={selectedElement.vinylType || "textil_flex"}
              onChange={(e) =>
                onUpdateElement({
                  vinylType: e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
            >
              {VINYL_VARIANTS.map((variant) => (
                <option key={variant.value} value={variant.value}>
                  {variant.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        {selectedElement.technique === "rhinestones" && (
          <Field label="Tipo de pedrería">
            <select
              value={selectedElement.rhinestonesType || "6ss"}
              onChange={(e) =>
                onUpdateElement({
                  rhinestonesType: e.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
            >
              {RHINESTONES_VARIANTS.map((variant) => (
                <option key={variant.value} value={variant.value}>
                  {variant.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Tamaño">
          <select
            value={selectedElement.sizeLabel ?? selectedSizeOptions[0]?.value ?? ""}
            onChange={(e) =>
              onUpdateElement({
                sizeLabel: e.target.value,
              })
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-blue-500"
          >
            {selectedSizeOptions.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  );
}