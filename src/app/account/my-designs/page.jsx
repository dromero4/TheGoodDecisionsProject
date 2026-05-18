"use client";

import axios from "axios";
import AccountNavbar from "../account-components/account-navbar";
import Header from "../account-components/header";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function MyDesigns() {

    const [diseños, setDiseños] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function designs() {
            try {
                setLoading(true);
                const response = await axios.get("/api/me/my-designs");
                const diseños = response.data;
                setDiseños(diseños);
            } catch (error) {
                console.error("Error al obtener los diseños:", error);
            } finally {
                setLoading(false);
            }
        }

        designs();
    }, [])

    return (
        <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
            <section className="mx-auto max-w-5xl">
                <AccountNavbar />
                <Header title="Gestiona tus diseños" subtitle="Mis diseños" />
            </section>
            <section>
                {
                    loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-950" />
                                <span className="text-sm font-medium text-slate-600">
                                    Cargando diseños...
                                </span>
                            </div>
                        </div>
                    ) : (
                        diseños.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                                {diseños.map((diseño) => (
                                    <div key={diseño.id} className="bg-white rounded-lg shadow-md p-4">
                                        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white">
                                            <Image
                                                src={diseño.previewImage}
                                                alt={diseño.name}
                                                fill
                                                unoptimized
                                                className="object-contain"
                                            />
                                        </div>
                                        <hr
                                            className="my-2 opacity-20" />
                                        <div>
                                            <h3 className="text-lg font-bold">{diseño.name}</h3>
                                            <p className="text-slate-500 text-sm">{diseño.category} · {diseño.Size} x {diseño.Quantity}...</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No tienes diseños guardados.</p>
                        )
                    )
                }
            </section>
        </main>
    )
}