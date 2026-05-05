"use client";

import { useEffect, useState } from "react";
import ProductCustomizerBase from "@/app/components/pageComponents/personalization/ProductCustomizerBase";

const IMAGE_INDEX_MAP_BY_CATEGORY = {
  tees: {
    front: 1,
    back: 0,
    leftSleeve: 7,
    rightSleeve: 8,
    neck: 1, // luego lo afinamos
  },

  sweatshirts: {
    front: 1,
    back: 0,
    leftSleeve: 6,
    rightSleeve: 7,
    neck: 4, // luego lo afinamos
    hood: 1,
    pocket: 5,
  },

  pants: {
    frontRightLeg: 2,
    frontLeftLeg: 2,
    backRightLeg: 1,
    backLeftLeg: 1,
    waist: 4,
    backPocket: 5,
  },
};

function normalizeCategory(category) {
  return String(category || "")
    .trim()
    .toLowerCase();
}

function getImageMapByCategory(category) {
  const normalized = normalizeCategory(category);

  if (normalized.includes("tee")) return IMAGE_INDEX_MAP_BY_CATEGORY.tees;
  if (normalized.includes("sweat")) return IMAGE_INDEX_MAP_BY_CATEGORY.sweatshirts;
  if (normalized.includes("hoodie")) return IMAGE_INDEX_MAP_BY_CATEGORY.sweatshirts;
  if (normalized.includes("pant")) return IMAGE_INDEX_MAP_BY_CATEGORY.pants;

  return IMAGE_INDEX_MAP_BY_CATEGORY.tees;
}

function buildZoneImages(fallbackImages, category) {
  const map = getImageMapByCategory(category);
  const firstImage = fallbackImages?.[0]?.url || null;

  const result = {};

  Object.entries(map).forEach(([zoneKey, imageIndex]) => {
    result[zoneKey] = fallbackImages?.[imageIndex]?.url || firstImage;
  });

  return result;
}

export default function Personalization({ product, 
  selectedColor, 
  quantity, 
  basePriceBreakdown = [], 
  garmentBaseTotal = 0 
}) {
  const [open, setOpen] = useState(false);
  const [appliedCustomization, setAppliedCustomization] = useState(null);

  const isDisabled = !quantity || quantity < 10;

  const normalize = (value) =>
    String(value ?? "").trim().toLowerCase();

  const images = product?.images ?? [];

  const filteredImages = !selectedColor
    ? images
    : images.filter((img) => normalize(img.color) === normalize(selectedColor));

  const fallbackImages = filteredImages.length ? filteredImages : images;

const zoneImages = buildZoneImages(fallbackImages, product?.category);

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
  disabled={isDisabled}
  onClick={() => {
    if (isDisabled) return;
    setOpen(true);
  }}
  className={`my-3 rounded-md px-5 py-3 font-semibold text-white transition ${
    isDisabled
      ? "cursor-not-allowed bg-slate-300"
      : "bg-blue-500 hover:bg-blue-700"
  }`}
>
  Personalize {product?.category}
</button>

{isDisabled && (
  <p className="text-sm text-slate-500">
    Selecciona al menos 10 unidades para poder personalizar.
  </p>
)}

      <div
  className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 ${
    open ? "block" : "hidden"
  }`}
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

    {appliedCustomization && (
  <div className="mt-3 border border-green-200 bg-green-50 p-4 text-sm text-green-800">
    <p className="font-semibold">Personalización aplicada</p>

    <p className="mt-1">
      {appliedCustomization.placements.length} elemento(s) personalizados
    </p>

    <p className="mt-1">
      Total personalización:{" "}
      <strong>
        {Number(appliedCustomization.customizationTotal || 0).toFixed(2)} €
      </strong>
    </p>

    <p>
      Total estimado:{" "}
      <strong>
        {Number(appliedCustomization.finalTotal || 0).toFixed(2)} €
      </strong>
    </p>

    
  </div>
)}


    <div className="h-full overflow-y-auto p-4 md:p-6">
      <ProductCustomizerBase
        zoneImages={zoneImages}
        category={product?.category}
        quantity={quantity}
        basePriceBreakdown={basePriceBreakdown}
        garmentBaseTotal={garmentBaseTotal}
        onApplyCustomization={(payload) => {
          setAppliedCustomization(payload);
          setOpen(false);
        }}
      />
    </div>
  </div>
</div>
    </>
  );
}