"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import AccountNavbar from "../account-components/account-navbar";
import Header from "../account-components/header";
import Image from "next/image";
import { ThumbsUp } from "lucide-react";
import { Heart } from "lucide-react";
import CardDesign from "@/app/components/pageComponents/community-designs/card-design";

export default function CommunityDesigns() {
    const [communityDesigns, setCommunityDesigns] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {


        async function getCommunityDesigns() {
            try {
                const res = await axios.get("/api/me/community-designs");

                setCommunityDesigns(res.data);
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
                                <CardDesign key={design.id} design={design}/>
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