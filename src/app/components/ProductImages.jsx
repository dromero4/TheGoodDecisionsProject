"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

export default function ProductImages({ images = [] }) {
  const safeImages = images ?? [];

  const [activeId, setActiveId] = useState(safeImages[0]?.id ?? null);
  const [loadedMain, setLoadedMain] = useState(false);

  // Cuando cambian las imágenes (por color, etc.), resetea a la primera
  useEffect(() => {
    setActiveId(safeImages[0]?.id ?? null);
    setLoadedMain(false);
  }, [safeImages?.[0]?.id]);

  const activeImage = useMemo(() => {
    return safeImages.find((i) => i.id === activeId) ?? safeImages[0] ?? null;
  }, [safeImages, activeId]);

  if (!activeImage) return null;

  return (
    <section className="w-105">
      {/* IMAGE PREVIEW */}
      <div className="flex justify-center mb-4">
        <div className="relative w-100 h-95 rounded-2xl overflow-hidden ">
          {/* {!loadedMain && (
            <div className="absolute inset-0 animate-pulse bg-black/10" />
          )} */}

          <Image
            src={activeImage.url}
            alt={activeImage.alt ?? String(activeImage.id ?? "Product image")}
            fill
            sizes="400px"
            priority
            className={[
              "object-contain transition-opacity duration-300",
              loadedMain ? "opacity-100" : "opacity-0",
            ].join(" ")}
            onLoad={() => setLoadedMain(true)}
          />
        </div>
      </div>

      {/* REST OF THE IMAGES */}
      <div className="grid grid-cols-4 gap-2">
        {safeImages.map((img) => {
          const isActive = img.id === activeImage.id;

          return (
            <button
              key={img.id}
              type="button"
              onClick={() => {
                setActiveId(img.id);
                setLoadedMain(false);
              }}
              className={[
                "relative aspect-5/4 rounded-xl overflow-hidden border transition",
                isActive ? "border-black" : "border-black/0 hover:border-black/20",
              ].join(" ")}
            >
              <Image
                src={img.url}
                alt={img.alt ?? String(img.id ?? "Thumbnail")}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
