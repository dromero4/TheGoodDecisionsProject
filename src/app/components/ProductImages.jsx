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
  <section className="mx-auto w-full max-w-190 min-w-0 overflow-hidden">
    {/* IMAGE PREVIEW */}
    <div className="mb-4 flex justify-center">
      <div className="relative w-full max-w-105 overflow-hidden rounded-2xl">
        <div className="relative aspect-square w-full">
          <Image
            src={activeImage.url}
            alt={activeImage.alt ?? String(activeImage.id ?? "Product image")}
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            priority
            className={[
              "object-contain transition-opacity duration-300",
              loadedMain ? "opacity-100" : "opacity-0",
            ].join(" ")}
            onLoad={() => setLoadedMain(true)}
          />
        </div>
      </div>
    </div>

    {/* REST OF THE IMAGES */}
    <div className="grid w-full min-w-0 grid-cols-3 gap-2 sm:grid-cols-4">
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
              "relative w-full overflow-hidden rounded-xl border transition",
              isActive ? "border-black" : "border-black/0 hover:border-black/20",
            ].join(" ")}
          >
            <div className="relative aspect-[5/4] w-full">
              <Image
                src={img.url}
                alt={img.alt ?? String(img.id ?? "Thumbnail")}
                fill
                sizes="(max-width: 640px) 33vw, 180px"
                className="object-cover"
              />
            </div>
          </button>
        );
      })}
    </div>
  </section>
);
}
