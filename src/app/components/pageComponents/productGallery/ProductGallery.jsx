// Vista principal del producto
// Aqui se muestra las imagenes, el color, las tallas de cada uno de los productos...

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

    // Normalizamos las imagenes para evitar problemas de null / undefined.
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


    // Colores únicos a partir de las variantes del producto
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

    // Funcion para incrementar la cantidad de la talla, respetando el stock disponible.
    // En caso de superarse, se controla con un alert.
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

    // Funcion para decrementar la cantidad de la talla. Si llega a 0, se elimina del resumen y
    //  se desactiva la talla (si era la activa). Si no hay tallas seleccionadas, 
    // se limpia la selección de color.
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
       <main className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-8 px-4 md:grid-cols-[minmax(0,760px)_420px] md:px-8" aria-label="Galería de producto">
            <section className="min-w-0">
                <ProductImages images={filteredImages} />
            </section>

            <section className="w-full min-w-0 max-w-full md:max-w-[420px]">
                <ProductInfo product={product} price={price} />

                <ColorSelector
                    colors={colors}
                    selectedColor={selectedColor}
                    onSelect={handleColor}
                />

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
                    <div className="animate-slide-in-top fixed left-1/2 top-5 z-9999 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800 shadow-2xl transition-all">
                        {cartFeedback}
                    </div>
                )}
            </section>
        </main>
    );
}
