"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import CartItem from "./CartItem";
import ShippingAddressForm from "./ShippingAddressForm";
import { validateCartBeforeCheckout } from "./cartValidation";
import { validateShippingAddress } from "@/app/lib/validations/validateShippingAddress";

const EMPTY_SHIPPING_ADDRESS = {
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
};

export default function CartDrawer({ open, onClose }) {
  const {
    cartItems,
    cartTotal,
    cartQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [shippingErrors, setShippingErrors] = useState({});

  const [accountUser, setAccountUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(EMPTY_SHIPPING_ADDRESS);

  useEffect(() => {
    if (!open) return;

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
  }, [open]);

  function updateShippingField(field, value) {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleCheckout() {
    const cartValidation = validateCartBeforeCheckout({
      cartItems,
      cartQuantity,
      shippingAddress,
    });

    if (!cartValidation.valid) {
      alert(cartValidation.message);
      return;
    }

    setShippingErrors({});

    const addressValidation = validateShippingAddress(shippingAddress);

    if (!addressValidation.isValid) {
      setShippingErrors(addressValidation.errors);
      alert("Revisa los datos de la dirección de envío.");
      return;
    }

    try {
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
    } catch (error) {
      console.error("CHECKOUT ERROR:", error?.message || error);
      alert("Error inesperado creando el pago.");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
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
            onClick={onClose}
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
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>

              <ShippingAddressForm
                shippingAddress={shippingAddress}
                updateShippingField={updateShippingField}
                loadingUser={loadingUser}
                accountUser={accountUser}
                errors={shippingErrors}
              />
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
  );
}