"use client"

import Link from "next/link";
import { handleLogout } from "../helpers/account-helpers";
import { useRouter } from "next/navigation";

export default function Header({ title, subtitle }) {
    const router = useRouter();
    return (
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {title}
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                    {subtitle}
                </h1>
            </div>

            <div className="flex gap-3">
                <Link
                    href="/"
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    Volver a tienda
                </Link>

                <button
                    type="button"
                    onClick={() => handleLogout(router)}
                    className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    )
}