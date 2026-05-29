import Image from "next/image";
import { Rnd } from "react-rnd";

import HelpTooltip from "./HelpTooltip";
import { RESIZE_HANDLE_STYLES } from "./customizerConstants";
import type { CustomElement, ZoneId } from "./customizerTypes";
import { useRef, useState } from "react";

type PreviewPanelProps = {
  activeZone: ZoneId;
  activeZoneElements: CustomElement[];
  selectedElementId: string | null;
  previewImage: string | null;
  zoneLabels: Record<string, string>;
  onSelectElement: (id: string) => void;
  onUpdateZoneElements: (
    zone: ZoneId,
    updater: (elements: CustomElement[]) => CustomElement[]
  ) => void;
  reference: React.RefObject<HTMLDivElement>;
  isCapturing: boolean;
};

export default function PreviewPanel({
  activeZone,
  activeZoneElements,
  selectedElementId,
  previewImage,
  zoneLabels,
  onSelectElement,
  onUpdateZoneElements,
  reference,
  isCapturing,
}: PreviewPanelProps) {



  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 xl:sticky xl:top-4 xl:max-h-[calc(90vh-5rem)] xl:self-start">
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <h3
            className="text-lg font-semibold"
            style={{ color: "#0f172a" }}
          >
            Vista previa
          </h3>
          <HelpTooltip />
        </div>

        <p
          className="text-sm"
          style={{ color: "#64748b" }}
        >
          Vista de la zona:{" "}
          <span className="font-medium">
            {zoneLabels[activeZone]}
          </span>
        </p>
      </div>

      <div className="flex justify-center">
        <div
          ref={reference}
          className="relative h-140 w-full max-w-130 overflow-hidden rounded-2xl border"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#cbd5e1",
            color: "#111111",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {previewImage ? (
              <Image
                src={previewImage}
                alt={zoneLabels[activeZone]}
                fill
                unoptimized
                sizes="(max-width: 1280px) 100vw, 520px"
                className="object-contain"
                draggable={false}
              />
            ) : (
              <div className="text-center">
                <p
                  className="text-xl font-semibold"
                  style={{ color: "#334155" }}
                >
                  Vista previa de la prenda
                </p>
                <p
                  className="text-sm"
                  style={{ color: "#94a3b8" }}
                >
                  {zoneLabels[activeZone]}
                </p>
              </div>
            )}
          </div>

          {activeZoneElements.map((element) => {
            const isSelected = element.id === selectedElementId;

            return (
              <Rnd
                key={element.id}
                bounds="parent"
                size={{
                  width: element.width,
                  height: element.height,
                }}
                position={{
                  x: element.x,
                  y: element.y,
                }}
                enableResizing={
                  false
                    ? {
                      top: true,
                      right: true,
                      bottom: true,
                      left: true,
                      topRight: true,
                      bottomRight: true,
                      bottomLeft: true,
                      topLeft: true,
                    }
                    : false
                }
                resizeHandleStyles={isSelected ? RESIZE_HANDLE_STYLES : {}}
                onDragStart={() => onSelectElement(element.id)}
                onMouseDown={() => onSelectElement(element.id)}
                onDragStop={(event, data) => {
                  onSelectElement(element.id);

                  onUpdateZoneElements(activeZone, (elements) =>
                    elements.map((item) =>
                      item.id === element.id
                        ? {
                          ...item,
                          x: data.x,
                          y: data.y,
                        }
                        : item
                    )
                  );
                }}
                onResizeStop={(event, direction, ref, delta, position) => {
                  onSelectElement(element.id);

                  const newWidth = parseInt(ref.style.width, 10);
                  const newHeight = parseInt(ref.style.height, 10);

                  onUpdateZoneElements(activeZone, (elements) =>
                    elements.map((item) =>
                      item.id === element.id
                        ? {
                          ...item,
                          width: newWidth,
                          height: newHeight,
                          x: position.x,
                          y: position.y,
                        }
                        : item
                    )
                  );
                }}
                className={isSelected ? "z-10" : "z-1"}
                style={{
                  background: "transparent",
                  border: "none",
                  overflow: "visible",
                }}
              >
                <div
                  className={`flex h-full w-full items-center justify-center p-2 text-center ${isSelected && !isCapturing
                      ? "ring-2 ring-blue-500/70 ring-offset-2 ring-offset-white"
                      : ""
                    }`}
                  style={{
                    transform: `rotate(${element.rotation}deg)`,
                    transformOrigin: "center center",
                  }}
                >
                  {element.type === "text" ? (
                    <span
                      style={{
                        color: element.textColor || "#111111",
                        fontSize: `${element.fontSize || 24}px`,
                        lineHeight: 1.1,
                        whiteSpace: "pre-wrap",
                      }}
                      className="wrap-break-word font-semibold"
                    >
                      {element.text ?? "TEXT"}
                    </span>
                  ) : element.imageUrl ? (
                    <Image
                      src={element.imageUrl}
                      alt={element.name}
                      width={element.width || 120}
                      height={element.height || 120}
                      unoptimized
                      className="h-full w-full object-contain"
                      draggable={false}
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-center justify-center text-xs"
                      style={{ color: "#94a3b8" }}
                    >
                      Sin imagen
                    </div>
                  )}
                </div>
              </Rnd>
            );
          })}
        </div>
      </div>
    </section>
  );
}