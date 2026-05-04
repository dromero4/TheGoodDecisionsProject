"use client";

import { useEffect, useState } from "react";
import ProductCustomizerBase from "@/app/components/pageComponents/personalization/ProductCustomizerBase";

export default function Personalization({ product, 
  selectedColor, 
  quantity, 
  basePriceBreakdown = [], 
  garmentBaseTotal = 0 
}) {
  const [open, setOpen] = useState(false);

  const normalize = (value) =>
    String(value ?? "").trim().toLowerCase();

  const images = product?.images ?? [];

  const filteredImages = !selectedColor
    ? images
    : images.filter((img) => normalize(img.color) === normalize(selectedColor));

  const fallbackImages = filteredImages.length ? filteredImages : images;

  const zoneImages = {
    front: fallbackImages[0]?.url || null,
    back: fallbackImages[1]?.url || fallbackImages[0]?.url || null,
    leftSleeve:
      fallbackImages[fallbackImages.length - 1]?.url ||
      fallbackImages[1]?.url ||
      fallbackImages[0]?.url ||
      null,
    rightSleeve:
      fallbackImages[fallbackImages.length - 2]?.url ||
      fallbackImages[0]?.url ||
      null,
    neck: fallbackImages[2]?.url || fallbackImages[0]?.url || null,
    hood: fallbackImages[4]?.url || fallbackImages[0]?.url || null,
    pocket: fallbackImages[6]?.url || fallbackImages[0]?.url || null,

    frontRightLeg: fallbackImages[0]?.url || null,
    frontLeftLeg: fallbackImages[1]?.url || fallbackImages[0]?.url || null,
    backRightLeg: fallbackImages[2]?.url || fallbackImages[0]?.url || null,
    backLeftLeg: fallbackImages[3]?.url || fallbackImages[0]?.url || null,
    waist: fallbackImages[4]?.url || fallbackImages[0]?.url || null,
    backPocket: fallbackImages[5]?.url || fallbackImages[0]?.url || null,

    leftSide: fallbackImages[1]?.url || fallbackImages[0]?.url || null,
    rightSide: fallbackImages[2]?.url || fallbackImages[0]?.url || null,
    visor: fallbackImages[3]?.url || fallbackImages[0]?.url || null,
  };

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      <button
        id="personalize"
        onClick={() => setOpen(true)}
        className="my-3 rounded-md bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        Personalize {product.category}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative h-[90vh] w-full max-w-350 overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-20 rounded-md bg-white px-3 py-1 text-sm font-medium text-slate-700 shadow hover:bg-slate-100"
            >
              ✕
            </button>

            <div className="h-full overflow-y-auto p-4 md:p-6">
              <ProductCustomizerBase
                zoneImages={zoneImages}
                category={product.category}
                quantity={quantity}
                basePriceBreakdown={basePriceBreakdown}
                garmentBaseTotal={garmentBaseTotal}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}