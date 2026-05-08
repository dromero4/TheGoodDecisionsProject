"use client";

import { useEffect, useMemo, useState } from "react";
import ProductImages from "../../ProductImages";
import ColorSelector from "../../ColorSelector";
import Personalization from "../personalization/Personalization";
import { useCart } from "../../../context/CartContext";

import {
    buildBasePriceBreakdown,
    getGarmentBaseTotal,
} from "./productPricing";

import { getCartItemSignature } from "./cartSignature";

import ProductSelectionSummary from "./ProductSelectionSummary";
import SizeSelector from "./SizeSelector";
import BulkDiscountTable from "./BulkDiscountTable";

import SelectedSizesSummary from "./SelectedSizesSummary";
import AddToCartButton from "./addToCartButton";
import ProductInfo from "./ProductInfo";
import ProductNotice from "./ProductNotice";

export default function ProductGallery({ product }) {
    const { addToCart, cartItems, cartTotal, removeFromCart } = useCart();
    const [appliedCustomization, setAppliedCustomization] = useState(null);

    const [cartFeedback, setCartFeedback] = useState(null);

    const images = useMemo(() => product?.images ?? [], [product?.images]);

    function getStockForSize(size) {
        const variant = (product?.variants ?? []).find(
            (variant) =>
                variant.color === selectedColor &&
                variant.size === size
        );

        return Number(variant?.stock || 0);
    }

    function setQty(size, value) {
        setAppliedCustomization(null);

        const stock = getStockForSize(size);
        const n = Math.max(0, Math.floor(Number(value) || 0));


        console.log("PRODUCT VARIANTS:", product?.variants);
        console.log("FIRST VARIANT:", product?.variants?.[0]);

        if (n > stock) {
            alert(`Solo hay ${stock} unidades disponibles en la talla ${size}.`);
            return;
        }

        setSizeQty((prev) => {
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
        const stock = getStockForSize(size);

        if (stock <= 0) {
            alert(`La talla ${size} no tiene stock disponible.`);
            return;
        }

        setAppliedCustomization(null);
        setActiveSize(size);

        setSizeQty((prev) => {
            if (prev[size]) return prev;

            return {
                ...prev,
                [size]: 1,
            };
        });
    }
    function inc(size) {
        setAppliedCustomization(null);
        setActiveSize(size);

        const stock = getStockForSize(size);

        setSizeQty((prev) => {
            const currentQty = prev[size] ?? 0;
            const nextQty = currentQty + 1;

            if (nextQty > stock) {
                alert(`Solo hay ${stock} unidades disponibles en la talla ${size}.`);
                return prev;
            }

            return {
                ...prev,
                [size]: nextQty,
            };
        });
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



    const basePriceBreakdown = useMemo(() => {
        return buildBasePriceBreakdown({
            sizeQty,
            variants: product?.variants,
            selectedColor,
            totalUnits,
        });
    }, [sizeQty, product?.variants, selectedColor, totalUnits]);

    const garmentBaseTotal = useMemo(() => {
        return getGarmentBaseTotal(basePriceBreakdown);
    }, [basePriceBreakdown]);




    const canAddToCart = totalUnits >= 10;
    function handleAddToCart() {
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
            setCartFeedback(
                "Este producto con la misma configuración ya está en el carrito."
            );

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
    }
    return (
        <main className="flex justify-evenly">
            <section>
                <ProductImages images={filteredImages} />
            </section>

            <section className="max-w-125">
                <ProductInfo product={product} price={price} />

                <ColorSelector
                    colors={colors}
                    selectedColor={selectedColor}
                    onSelect={handleColor}
                />

                {/* Resumen selección */}
                <ProductSelectionSummary
                    totalUnits={totalUnits}
                    primarySize={primarySize}
                    onClear={() => {
                        setSizeQty({});
                        setActiveSize(null);
                        setQtyDraft({});
                        setAppliedCustomization(null);
                    }}
                />



                {/* Tallas + badge bonito */}
                <SizeSelector
                    sizesForColor={sizesForColor}
                    sizeQty={sizeQty}
                    qtyDraft={qtyDraft}
                    primarySize={primarySize}
                    getStockForSize={getStockForSize}
                    selectSize={selectSize}
                    inc={inc}
                    dec={dec}
                    setQty={setQty}
                    setQtyDraft={setQtyDraft}
                />



                <SelectedSizesSummary
                    totalUnits={totalUnits}
                    sizeSummary={sizeSummary}
                />

                <hr className="mt-5" />

                {/* Bulk discount */}
                <BulkDiscountTable
                    tiers={tiers}
                    primarySize={primarySize}
                    selectedSizes={selectedSizes}
                />

                <Personalization
                    product={product}
                    selectedColor={selectedColor}
                    quantity={totalUnits}
                    basePriceBreakdown={basePriceBreakdown}
                    garmentBaseTotal={garmentBaseTotal}
                    appliedCustomization={appliedCustomization}
                    onCustomizationApplied={setAppliedCustomization}
                />

                <ProductNotice totalUnits={totalUnits} />



                <AddToCartButton
                    canAddToCart={canAddToCart}
                    onAddToCart={handleAddToCart}
                    cartFeedback={cartFeedback}
                />

                {cartFeedback && (
                    <div className="animate-slide-in-top transition-all fixed left-1/2 top-5 z-9999 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800 shadow-2xl">
                        {cartFeedback}
                    </div>
                )}

            </section>

        </main>
    );
}
