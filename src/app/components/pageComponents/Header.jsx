"use client";

import Image from "next/image";

import logo from '../../../../public/images/logo.svg'
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import axios from "axios";

export default function Header() {

    const [cartOpen, setCartOpen] = useState(false);

    const {
        cartItems,
        cartTotal,
        cartQuantity,
        removeFromCart,
        clearCart,
    } = useCart();



    return (
        <>

            {cartOpen && (
                <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setCartOpen(false)}>
                    <div
                        className="absolute right-0 top-0 h-full w-full max-w-md bg-white p-5 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <p className="text-lg font-bold text-slate-900">Carrito</p>
                                <p className="text-sm text-slate-500">
                                    {cartQuantity} unidad(es)
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setCartOpen(false)}
                                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                            >
                                ✕
                            </button>
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                                El carrito está vacío.
                            </div>
                        ) : (
                            <>
                                <div className="max-h-[calc(90vh-190px)] space-y-3 overflow-y-auto pr-1">
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {item.productId} - {item.productName}
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Color: {item.selectedColor} · {item.totalUnits} uds
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Tallas:{" "}
                                                        {item.sizes
                                                            ?.map((s) => `${s.size} x${s.quantity}`)
                                                            .join(", ")}
                                                    </p>

                                                    {item.customization ? (
                                                        <p className="mt-1 text-xs text-slate-500">
                                                            Personalización: {item.customization.placements.length} elemento(s)
                                                        </p>
                                                    ) : (
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            Sin personalización
                                                        </p>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>

                                            <div className="mt-3 border-t border-slate-200 pt-3">
                                                <div className="flex justify-between text-xs text-slate-600">
                                                    <span>Prendas</span>
                                                    <span>{Number(item.garmentBaseTotal || 0).toFixed(2)} €</span>
                                                </div>

                                                <div className="flex justify-between text-xs text-slate-600">
                                                    <span>Personalización</span>
                                                    <span>
                                                        {item.customization
                                                            ? `${Number(item.customizationTotal || 0).toFixed(2)} €`
                                                            : "No aplicada"}
                                                    </span>
                                                </div>

                                                <div className="mt-2 flex justify-between font-bold text-slate-900">
                                                    <span>Total</span>
                                                    <span>{Number(item.finalTotal || 0).toFixed(2)} €</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-5 border-t border-slate-200 pt-4">
                                    <div className="flex justify-between text-base font-bold text-slate-900">
                                        <span>Total carrito</span>
                                        <span>{Number(cartTotal || 0).toFixed(2)} €</span>
                                    </div>

                                    <button
                                        type="button"
                                        className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                                        onClick={async () => {
                                            const response = await fetch("/api/checkout", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({ items: cartItems }),
                                            });

                                            const data = await response.json();

                                            if (!response.ok) {
                                                alert(data.error || "Error creando el pago.");
                                                return;
                                            }

                                            sessionStorage.setItem("lastStripeCheckoutUrl", data.url);

                                            window.location.href = data.url;
                                        }}
                                    >
                                        Continuar
                                    </button>

                                    <button
                                        type="button"
                                        onClick={clearCart}
                                        className="mt-3 w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                                    >
                                        Vaciar carrito
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <header className="flex justify-center items-center flex-col">
                <Link href="/">
                    <Image
                        src={logo}
                        alt="Logo"
                        href="/"
                        width={300}
                        height="auto"
                        className="mt-5"></Image>
                </Link>
                <h1 className="xl:text-5xl sm:text-3xl mb-10"><span className="font-bold">Customization</span> Market</h1>
            </header>
            <aside className="absolute top-0 right-0 m-6">

                <button
                    type="button"
                    onClick={() => setCartOpen((prev) => !prev)}
                    className="relative rounded-xl border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-black/5"
                >
                    Carrito

                    {cartItems.length > 0 && (
                        <span className="ml-2 rounded-full bg-black px-2 py-0.5 text-xs text-white">
                            {cartItems.length}
                        </span>
                    )}
                </button>

            </aside>

            <main className="text-center mb-5">
                <hr />
                <p className="uppercase my-3 font-bold">Create your collection now!</p>
                <hr />
            </main>
        </>


    )
}