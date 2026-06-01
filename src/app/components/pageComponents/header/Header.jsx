"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const { cartItems } = useCart();

  return (
    <>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <header className="relative border-b border-slate-200 bg-white px-5 py-6 text-slate-950">
        <div className="absolute right-5 top-5 flex items-center gap-3">
          <Link
            href="/account/account-settings"
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
              src="/images/logo.svg"
              alt="The Good Decisions logo"
              width={280}
              height={120}
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

      <section className="border-b border-slate-200 bg-slate-50 px-5 py-5 mb-5 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-700">
          Crea tu colección ahora!
        </p>
      </section>
    </>
  );
}