"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import AccountNavbar from "../account-components/account-navbar";
import Header from "../account-components/header";
import Image from "next/image";

export default function CommunityDesigns() {
    const [communityDesigns, setCommunityDesigns] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getCommunityDesigns() {
            try {
                const res = await axios.get("/api/me/community-designs");

                setCommunityDesigns(res.data);
                console.log(res.data);
            } catch (error) {
                console.log("Ha habido un error", error);
            } finally {
                setLoading(false);
            }
        }

        getCommunityDesigns();
    }, []);


    return (
        <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
            <section className="mx-auto max-w-5xl">
                <AccountNavbar />
                <Header
                    title="Explora diseños compartidos por otros usuarios"
                    subtitle="Diseños de la comunidad"
                />
            </section>

            <section className="mx-auto max-w-5xl">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
                            Galería de comunidad
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Inspírate con diseños públicos creados por otros usuarios.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex min-h-80 items-center justify-center rounded-3xl border border-slate-200 bg-slate-50">
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-950" />

                                <div className="text-center">
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">
                                        Cargando diseños
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Estamos preparando la galería de la comunidad.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : communityDesigns.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {communityDesigns.map((design) => (
                                <article
                                    key={design.id}
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
                                        {design.previewImage ? (
                                            <Image
                                                src={design.previewImage}
                                                alt={design.name}
                                                fill
                                                unoptimized
                                                className="object-contain p-3 transition duration-300 group-hover:scale-[1.03]"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                                                Sin preview
                                            </div>
                                        )}
                                    </div>

                                    <div className="border-t border-slate-100 p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium text-slate-400">
                                                    {new Date(design.createdAt).toLocaleDateString("es-ES", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                    })}
                                                </p>

                                                <h3 className="mt-1 truncate text-lg font-bold uppercase tracking-tight text-slate-950">
                                                    {design.name}
                                                </h3>

                                                <p className="mt-1 truncate text-sm text-slate-500">
                                                    {design.category || "Sin categoría"} ·{" "}
                                                    {design.size || design.Size || "-"} x{" "}
                                                    {design.quantity || design.Quantity || "-"}
                                                </p>
                                            </div>

                                            <div className="pointer-events-none shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                {design.likes || 0} likes
                                            </div>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="pointer-events-none rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                Público
                                            </span>

                                            <button className=" hover:cursor-pointer rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                                                Ver diseño
                                            </button>
                                        </div>
                                        <p className="mt-2 text-sm opacity-60">
                                            {design.user.email}
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="flex min-h-80 items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8">
                            <div className="max-w-md text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl shadow-sm">
                                    ✦
                                </div>

                                <h3 className="text-lg font-bold uppercase tracking-tight text-slate-950">
                                    No hay diseños públicos todavía
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Cuando otros usuarios compartan sus diseños, aparecerán aquí
                                    como inspiración para la comunidad.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}