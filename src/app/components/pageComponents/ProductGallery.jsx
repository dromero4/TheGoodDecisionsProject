"use client";

import { useEffect, useMemo, useState } from "react";
import ProductImages from "../ProductImages";
import ColorSelector from "../ColorSelector";
import ProductAccordion from "../ProductAccordion";
import Personalization from "./personalization/Personalization";
import ProductCustomizerBase from "./personalization/ProductCustomizerBase";
import { useCart } from "../../context/CartContext";

export default function ProductGallery({ product }) {
    const { addToCart, cartItems, cartTotal, removeFromCart } = useCart();
    const [appliedCustomization, setAppliedCustomization] = useState(null);

    const [cartFeedback, setCartFeedback] = useState(null);

    const images = useMemo(() => product?.images ?? [], [product?.images]);


    function setQty(size, value) {
        setAppliedCustomization(null);
        const n = Math.max(0, Math.floor(Number(value) || 0));

        setSizeQty(prev => {
            const next = { ...prev };
            if (n <= 0) delete next[size];
            else next[size] = n;
            return next;
        });
    }


    // Colores únicos (evita null/undefined)
    const colors = useMemo(() => {
        return [...new Set((product?.variants ?? []).map((v) => v.color).filter(Boolean))];
    }, [product?.variants]);

    const [selectedColor, setSelectedColor] = useState(null);
    const [activeSize, setActiveSize] = useState(null);
    const [sizeQty, setSizeQty] = useState({}); // { [size]: qty }
    const [qtyDraft, setQtyDraft] = useState({}); // { [size]: "123" }

    // Inicializar color cuando llegan variantes/colores
    useEffect(() => {
        if (!selectedColor && colors.length) setSelectedColor(colors[0]);
    }, [colors, selectedColor]);

    function handleColor(color) {
        setSelectedColor(color);
        setActiveSize(null);
        setSizeQty({});
        setQtyDraft({});
    }



    // Tallas disponibles por color
    const sizesForColor = useMemo(() => {
        if (!selectedColor) return [];
        return [
            ...new Set(
                (product?.variants ?? [])
                    .filter((v) => v.color === selectedColor)
                    .map((v) => v.size)
                    .filter(Boolean)
            ),
        ];
    }, [product?.variants, selectedColor]);

    const sizeSummary = useMemo(() => {
        // solo tallas con qty > 0 y ordenadas como aparecen en sizesForColor
        const entries = Object.entries(sizeQty).filter(([, q]) => (Number(q) || 0) > 0);

        const order = sizesForColor?.length ? sizesForColor : entries.map(([s]) => s);

        return entries.sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
    }, [sizeQty, sizesForColor]);

    // Imágenes filtradas por color (si no hay color, mostramos todas)
    const filteredImages = useMemo(() => {
        if (!selectedColor) return images;
        return images.filter((img) => img.color === selectedColor);
    }, [images, selectedColor]);

    const selectedSizes = useMemo(() => Object.keys(sizeQty), [sizeQty]);

    // Si activeSize desaparece (qty 0), ponemos como activa la última seleccionada
    useEffect(() => {
        if (activeSize && sizeQty[activeSize] == null) {
            const keys = Object.keys(sizeQty);
            setActiveSize(keys[keys.length - 1] ?? null);
        }
    }, [sizeQty, activeSize]);

    const primarySize = useMemo(() => {
        return activeSize ?? selectedSizes[selectedSizes.length - 1] ?? null;
    }, [activeSize, selectedSizes]);

    // Variante seleccionada (color + talla principal)
    const selectedVariant = useMemo(() => {
        if (!selectedColor || !primarySize) return null;
        return (
            (product?.variants ?? []).find(
                (v) => v.color === selectedColor && v.size === primarySize
            ) ?? null
        );
    }, [product?.variants, selectedColor, primarySize]);

    const price = selectedVariant?.prices?.[0] ?? null;

    // Tabla descuentos de la variante seleccionada
    const tiers = useMemo(() => {
        if (!price) return [];
        return [
            { label: "10 - 99", price: price.gt10 },
            { label: "100 - 499", price: price.gt100 },
            { label: "500 - 999", price: price.gt500 },
            { label: "> 1000", price: price.gt1000 },
        ].filter((t) => t.price != null);
    }, [price]);

    function selectSize(size) {
        setAppliedCustomization(null);

        setActiveSize(size);
        setSizeQty((prev) => (prev[size] ? prev : { ...prev, [size]: 1 }));
    }

    function inc(size) {
        setAppliedCustomization(null);

        setActiveSize(size);
        setSizeQty((prev) => ({ ...prev, [size]: (prev[size] ?? 0) + 1 }));
    }

    function dec(size) {
        setAppliedCustomization(null);

        setSizeQty((prev) => {
            const next = { ...prev };
            const n = (next[size] ?? 0) - 1;
            if (n <= 0) delete next[size];
            else next[size] = n;
            return next;
        });
    }

    const totalUnits = useMemo(() => {
        return Object.values(sizeQty).reduce((a, b) => a + (Number(b) || 0), 0);
    }, [sizeQty]);

    function getTierUnitPrice(price, totalUnits) {
        if (!price) return 0;

        if (totalUnits >= 1000) {
            return Number(price.gt1000 ?? price.gt500 ?? price.gt100 ?? price.gt10 ?? price.unit ?? 0);
        }

        if (totalUnits >= 500) {
            return Number(price.gt500 ?? price.gt100 ?? price.gt10 ?? price.unit ?? 0);
        }

        if (totalUnits >= 100) {
            return Number(price.gt100 ?? price.gt10 ?? price.unit ?? 0);
        }

        if (totalUnits >= 10) {
            return Number(price.gt10 ?? price.unit ?? 0);
        }

        return Number(price.unit ?? 0);
    }

    const basePriceBreakdown = useMemo(() => {
        return Object.entries(sizeQty)
            .filter(([, qty]) => Number(qty) > 0)
            .map(([size, qty]) => {
                const variant = (product?.variants ?? []).find(
                    (v) => v.color === selectedColor && v.size === size
                );

                const price = variant?.prices?.[0] ?? null;
                const unitPrice = getTierUnitPrice(price, totalUnits);
                const quantity = Number(qty) || 0;

                return {
                    size,
                    quantity,
                    unitPrice,
                    total: unitPrice * quantity,
                };
            });
    }, [sizeQty, product?.variants, selectedColor, totalUnits]);

    const garmentBaseTotal = useMemo(() => {
        return basePriceBreakdown.reduce((sum, item) => sum + item.total, 0);
    }, [basePriceBreakdown]);

    function getCartItemSignature(item) {
        const sizesSignature = (item.sizes || [])
            .map((sizeItem) => `${sizeItem.size}:${sizeItem.quantity}`)
            .sort()
            .join("|");



        const customizationSignature = item.customization
            ? JSON.stringify({
                placements: item.customization.placements?.map((placement) => ({
                    zone: placement.zone,
                    technique: placement.technique,
                    techniqueLabel: placement.techniqueLabel,
                    requestedSize: placement.requestedSize,
                    chargedSize: placement.chargedSize,
                    totalPrice: placement.totalPrice,
                })),
                customizationTotal: item.customization.customizationTotal,
            })
            : "no-customization";

        return [
            item.productId,
            item.selectedColor,
            sizesSignature,
            customizationSignature,
        ].join("::");
    }


const canAddToCart = totalUnits >= 10;
    return (
        <main className="flex justify-evenly">
            <section>
                <ProductImages images={filteredImages} />
            </section>

            <section className="max-w-125">
                <main className="mb-5">
                    <div className="text-3xl font-bold">
                        {product?.externalId} - {product?.name}
                    </div>

                    <div>{product?.shortDescription}</div>

                    <div className="mt-2 text-3xl font-semibold">
                        {price ? (
                            <>
                                {Number(price.gt10).toFixed(2)} €
                            </>
                        ) : (
                            <span className="text-sm opacity-60">
                                Please, select the size and the color first
                            </span>
                        )}
                    </div>

                    <ProductAccordion title="Description">
                        {product?.longDescription}
                    </ProductAccordion>
                </main>

                <ColorSelector
                    colors={colors}
                    selectedColor={selectedColor}
                    onSelect={handleColor}
                />

                {/* Resumen selección */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm opacity-70">
                        {totalUnits > 9 ? (
                            <>
                                Total: <strong>{totalUnits}</strong> unit(s)
                                {primarySize && (
                                    <>
                                        {" "}
                                        · Primary size: <strong>{primarySize}</strong>
                                    </>
                                )}
                            </>
                        ) : (
                            "The bare minimum to go ahead with the order is 10."
                        )}
                    </div>

                    {totalUnits > 0 && (
                        <button
                            type="button"
                            onClick={() => {
                                setSizeQty({});
                                setActiveSize(null);
                                setQtyDraft({});
                                setAppliedCustomization(null);
                            }}
                            className="text-xs px-3 py-1.5 rounded-full border border-black/10 hover:bg-black/3 transition"
                        >
                            Clear
                        </button>
                    )}
                </div>



                {/* Tallas + badge bonito */}
                <div className="flex gap-2 mt-4 justify-center flex-wrap">
                    {sizesForColor.map((size) => {
                        const qty = sizeQty[size] ?? 0;
                        const active = primarySize === size;

                        return (
                            <div
                                key={size}
                                type="button"
                                onClick={() => selectSize(size)}
                                className={[
                                    "group relative flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all",
                                    "active:scale-[0.98] cursor-pointer",
                                    qty > 0
                                        ? "border-black/20 bg-black/2"
                                        : "border-black/10 bg-white hover:bg-black/2",
                                    active ? "ring-2 ring-black/30" : "ring-0",
                                ].join(" ")}
                            >
                                <span className="font-medium">{size}</span>
                                {/* Pill con stepper (solo si qty > 0) */}
                                {qty > 0 && (
                                    <div
                                        className="ml-1 inline-flex items-center overflow-hidden rounded-full border border-black/10 bg-white shadow-sm"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => dec(size)}
                                            className="h-7 w-7 grid place-items-center hover:bg-black/4 active:bg-black/6"
                                            aria-label={`Decrease ${size}`}
                                        >
                                            <span className="text-base leading-none">−</span>
                                        </button>

                                        <input
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            className="w-14 h-7 text-center text-xs font-semibold tabular-nums outline-none"
                                            value={qtyDraft[size] ?? String(qty)}
                                            onChange={(e) => {
                                                // solo dígitos
                                                const raw = e.target.value.replace(/\D/g, "");
                                                setQtyDraft(prev => ({ ...prev, [size]: raw }));
                                            }}
                                            onBlur={() => {
                                                const raw = qtyDraft[size];
                                                const parsed = raw === "" || raw == null ? qty : parseInt(raw, 10);

                                                setQty(size, parsed);

                                                // limpiamos draft para que vuelva a mostrar el número real
                                                setQtyDraft(prev => {
                                                    const next = { ...prev };
                                                    delete next[size];
                                                    return next;
                                                });
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") e.currentTarget.blur();
                                                if (e.key === "ArrowUp") { e.preventDefault(); inc(size); }
                                                if (e.key === "ArrowDown") { e.preventDefault(); dec(size); }
                                            }}
                                            aria-label={`Quantity for ${size}`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => inc(size)}
                                            className="h-7 w-7 grid place-items-center hover:bg-black/4 active:bg-black/6"
                                            aria-label={`Increase ${size}`}
                                        >
                                            <span className="text-base leading-none">+</span>
                                        </button>
                                    </div>
                                )}


                                {/* Hint cuando no está seleccionada */}
                                {qty === 0 && (
                                    <span className="text-xs opacity-40 group-hover:opacity-70 transition">
                                        +
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>



                {totalUnits > 0 && sizeSummary.length > 0 && (
                    <div className="mt-5 flex gap-2 text-xs">
                        {sizeSummary.map(([size, qty]) => (
                            <span
                                key={size}
                                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-2.5 py-1"
                            >
                                <span className="font-semibold">{size}</span>
                                <span className="tabular-nums font-semibold">{qty}</span>
                            </span>
                        ))}
                    </div>
                )}

                <hr className="mt-5" />

                {/* Bulk discount */}
                <section className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold tracking-wide uppercase opacity-80">
                            Bulk discount
                        </span>
                        {primarySize && selectedSizes.length > 1 && (
                            <span className="text-xs text-black/50">
                                Showing tiers for: <strong>{primarySize}</strong>
                            </span>
                        )}
                    </div>

                    <div className="relative overflow-x-auto rounded-2xl border border-black/10 bg-white">
                        <table className="w-full text-sm cursor-default">
                            <thead className="bg-black/3">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-black/70">
                                        Quantity
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold text-black/70">
                                        Price
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-black/10">
                                {tiers.length ? (
                                    tiers.map((t) => (
                                        <tr key={t.label} className="transition-colors hover:bg-black/2">
                                            <th className="px-4 py-3 font-medium text-left whitespace-nowrap">
                                                {t.label}
                                            </th>
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                {t.price} €
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td className="px-4 py-4 text-sm text-black/50" colSpan={2}>
                                            Select a color and size to see bulk prices.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <p className="mt-2 text-xs text-black/50">
                        Prices shown per unit. Final price depends on variant and availability.
                    </p>



                </section>

                <Personalization
                    product={product}
                    selectedColor={selectedColor}
                    quantity={totalUnits}
                    basePriceBreakdown={basePriceBreakdown}
                    garmentBaseTotal={garmentBaseTotal}
                    appliedCustomization={appliedCustomization}
                    onCustomizationApplied={setAppliedCustomization}
                />

                {totalUnits < 10 && (
                    <p className="mt-2 text-sm text-slate-500 underline">
                        Selecciona al menos 10 unidades para añadir el producto al carrito.
                    </p>
                )}

                

                <button
                    type="button"
                    disabled={!canAddToCart}
                    onClick={() => {
                        const cartItem = {
                            productId: product?.externalId,
                            productName: product?.name,
                            category: product?.category,
                            selectedColor,
                            sizes: sizeSummary.map(([size, qty]) => ({
                                size,
                                quantity: Number(qty),
                            })),
                            totalUnits,
                            basePriceBreakdown,
                            garmentBaseTotal,
                            customization: appliedCustomization,
                            customizationTotal: appliedCustomization?.customizationTotal || 0,
                            finalTotal: appliedCustomization?.finalTotal ?? garmentBaseTotal,
                        };

                        const cartItemSignature = getCartItemSignature(cartItem);

                        const alreadyExists = cartItems.some(
                            (item) => getCartItemSignature(item) === cartItemSignature
                        );

                        if (alreadyExists) {
                           setCartFeedback("Este producto con la misma configuración ya está en el carrito.");

                            setTimeout(() => {
                                setCartFeedback(null);
                            }, 5000);

                            return;
                        }

                        addToCart(cartItem);

                        setCartFeedback(
  appliedCustomization
    ? "Producto personalizado añadido al carrito."
    : "Producto añadido al carrito sin personalización."
);

                        setTimeout(() => {
                            setCartFeedback(null);
                        }, 5000);
                    }}
                    className={`mt-4 w-full rounded-xl px-4 py-3 font-semibold text-white transition ${!canAddToCart
                            ? "cursor-not-allowed bg-slate-300"
                            : "bg-slate-900 hover:bg-slate-800"
                        }`}
                >
                    Añadir al carrito
                </button>

                {cartFeedback && (
                    <div className="animate-slide-in-top transition-all fixed left-1/2 top-5 z-[9999] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800 shadow-2xl">
                        {cartFeedback}
                    </div>
                )}

            </section>

        </main>
    );
}
