"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";

import logo from "../../../../public/images/logo.svg";

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);

  const [accountUser, setAccountUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    number: "",
    floorDoor: "",
    postalCode: "",
    city: "",
    province: "",
    country: "Spain",
    additionalInfo: "",
  });

  const {
    cartItems,
    cartTotal,
    cartQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  useEffect(() => {
    if (!cartOpen) return;

    async function loadAccountUser() {
      setLoadingUser(true);

      try {
        const response = await fetch("/api/me");

        if (response.status === 401) {
          setAccountUser(null);
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          setAccountUser(null);
          return;
        }

        setAccountUser(data.user);

        if (data.user?.address) {
          setShippingAddress({
            fullName: data.user.address.fullName || "",
            phone: data.user.address.phone || "",
            street: data.user.address.street || "",
            number: data.user.address.number || "",
            floorDoor: data.user.address.floorDoor || "",
            postalCode: data.user.address.postalCode || "",
            city: data.user.address.city || "",
            province: data.user.address.province || "",
            country: data.user.address.country || "Spain",
            additionalInfo: data.user.address.additionalInfo || "",
          });
        }
      } catch {
        setAccountUser(null);
      } finally {
        setLoadingUser(false);
      }
    }

    loadAccountUser();
  }, [cartOpen]);

  function updateShippingField(field, value) {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  }
  function getMissingShippingFields(address) {
    const requiredFields = [
      { key: "fullName", label: "nombre completo" },
      { key: "phone", label: "teléfono" },
      { key: "street", label: "calle" },
      { key: "number", label: "número" },
      { key: "postalCode", label: "código postal" },
      { key: "city", label: "ciudad" },
      { key: "province", label: "provincia" },
      { key: "country", label: "país" },
    ];

    return requiredFields.filter((field) => {
      return !String(address?.[field.key] || "").trim();
    });
  }

  function hasCompleteShippingAddress(address) {
    return getMissingShippingFields(address).length === 0;
  }



  async function handleCheckout() {
    const missingFields = getMissingShippingFields(shippingAddress);

    if (missingFields.length > 0) {
      alert(
        `Completa la dirección de entrega antes de continuar. Falta: ${missingFields
          .map((field) => field.label)
          .join(", ")}.`
      );
      return;
    }

    if (cartItems.length > 10) {
      alert(
        "El pedido tiene demasiados productos diferentes. Reduce el carrito o solicita presupuesto manual."
      );
      return;
    }

    if (cartQuantity > 300) {
      alert(
        "Para pedidos de más de 300 unidades, solicita presupuesto manual."
      );
      return;
    }

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cartItems,
        shippingAddress,
        customerEmail: accountUser?.email || "",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("CHECKOUT ERROR:", data);
      alert(data.message || data.error || "Error creando el pago.");
      return;
    }

    sessionStorage.setItem("lastStripeCheckoutUrl", data.url);
    window.location.href = data.url;
  }

  return (
    <>
      {cartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="absolute right-0 top-0 flex h-dvh w-full max-w-lg flex-col bg-white p-4 shadow-2xl sm:p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xl font-bold text-slate-950">Carrito</p>
                <p className="mt-1 text-sm text-slate-500">
                  {cartQuantity} unidad(es) · {cartItems.length} producto(s)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                ✕
              </button>
            </div>

            {cartItems.length === 0 ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <p className="text-sm font-semibold text-slate-800">
                    El carrito está vacío
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Añade productos para comenzar tu pedido.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto pr-1">
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-950">
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
                            className="shrink-0 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            Eliminar
                          </button>
                        </div>

                        <div className="mt-4 space-y-1 border-t border-slate-200 pt-3">
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

                          <div className="mt-2 flex justify-between text-sm font-bold text-slate-950">
                            <span>Total</span>
                            <span>{Number(item.finalTotal || 0).toFixed(2)} €</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-4">
                      <p className="text-sm font-bold text-slate-950">
                        Dirección de entrega
                      </p>

                      {loadingUser ? (
                        <p className="mt-1 text-xs text-slate-500">
                          Cargando dirección...
                        </p>
                      ) : accountUser?.address ? (
                        <p className="mt-1 text-xs text-slate-500">
                          Usaremos la dirección guardada en tu perfil. Puedes editarla aquí antes de pagar.
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-slate-500">
                          Añade una dirección para poder continuar con el pago.
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => updateShippingField("fullName", e.target.value)}
                        placeholder="Nombre completo"
                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                      />

                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => updateShippingField("phone", e.target.value)}
                        placeholder="Teléfono"
                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                      />

                      <div className="grid grid-cols-[1fr_70px] gap-3">
                        <input
                          type="text"
                          value={shippingAddress.street}
                          onChange={(e) => updateShippingField("street", e.target.value)}
                          placeholder="Calle"
                          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                        />

                        <input
                          type="text"
                          value={shippingAddress.number}
                          onChange={(e) => updateShippingField("number", e.target.value)}
                          placeholder="Nº"
                          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                        />
                      </div>

                      <input
                        type="text"
                        value={shippingAddress.floorDoor}
                        onChange={(e) => updateShippingField("floorDoor", e.target.value)}
                        placeholder="Piso / puerta / local"
                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                      />

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={shippingAddress.postalCode}
                          onChange={(e) => updateShippingField("postalCode", e.target.value)}
                          placeholder="Código postal"
                          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                        />

                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) => updateShippingField("city", e.target.value)}
                          placeholder="Ciudad"
                          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={shippingAddress.province}
                          onChange={(e) => updateShippingField("province", e.target.value)}
                          placeholder="Provincia"
                          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                        />

                        <input
                          type="text"
                          value={shippingAddress.country}
                          onChange={(e) => updateShippingField("country", e.target.value)}
                          placeholder="País"
                          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                        />
                      </div>

                      <textarea
                        value={shippingAddress.additionalInfo}
                        onChange={(e) => updateShippingField("additionalInfo", e.target.value)}
                        placeholder="Información adicional para la entrega"
                        rows={3}
                        className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div className="shrink-0 border-t border-slate-200 bg-white pt-4">
                  <div className="flex justify-between text-base font-bold text-slate-950">
                    <span>Total carrito</span>
                    <span>{Number(cartTotal || 0).toFixed(2)} €</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="mt-4 w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.99]"
                  >
                    Continuar con el pago
                  </button>

                  <button
                    type="button"
                    onClick={clearCart}
                    className="mt-3 w-full rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      <header className="relative border-b border-slate-200 bg-white px-5 py-6 text-slate-950">
        <div className="absolute right-5 top-5 flex items-center gap-3">
          <Link
            href="/account"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Mi cuenta
          </Link>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Carrito

            {cartItems.length > 0 && (
              <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-slate-950">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>

        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Link href="/" className="inline-flex">
            <Image
              src={logo}
              alt="The Good Decisions logo"
              width={280}
              priority
              className="h-auto w-56 md:w-72"
            />
          </Link>

          <h1 className="mt-5 text-3xl tracking-tight sm:text-4xl xl:text-5xl">
            <span className="font-bold">Customization</span> Market
          </h1>

          <p className="mt-4 max-w-xl text-sm text-slate-500">
            Elige prendas, personalízalas y crea tu colección desde una misma
            plataforma.
          </p>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-700">
          Create your collection now!
        </p>
      </section>
    </>
  );
}