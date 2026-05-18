"use client";

import axios from "axios";
import AccountNavbar from "../account-components/account-navbar";
import Header from "../account-components/header";
import { useEffect, useState } from "react";
import Image from "next/image";
import { div, hr } from "framer-motion/client";
import { Trash } from "lucide-react";
import { Edit } from "lucide-react";

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

    async function handleDelete(diseñoId){
        try {
            const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este diseño? Esta acción no se puede deshacer.");
            if (!confirmDelete) return;

            await axios.delete("/api/me/my-designs");
            alert("Diseño eliminado exitosamente.");
            setDiseños(diseños.filter(d => d.id !== diseñoId));
        } catch (error) {
            alert("Ocurrió un error al eliminar el diseño. Por favor, inténtalo de nuevo.");
            console.error("Error al eliminar el diseño:", error);
        }
    }

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
                            <>
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
                                        <div className="relative">
                                            <p className="text-slate-500 text-sm">
                                                {new Date(diseño.createdAt).toLocaleDateString("es-ES", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric",
                                                    })}
                                            </p>
                                            <h3 className="text-lg font-bold">{diseño.name}</h3>
                                            <p className="text-slate-500 text-sm">{diseño.category} · {diseño.Size} x {diseño.Quantity}...</p>
                                            <p className="absolute bottom-0 right-0 text-sm text-slate-500">{diseño.likes} likes</p>
                                        </div>
                                        <footer className="flex gap-4 mt-2 right-0">
                                            <button 
                                            className="border border-slate-500 p-1 rounded bg-blue-50 
                                            hover:bg-blue-200 hover:cursor-pointer"
                                            
                                            >
                                                <Edit className="h-5 w-5 text-blue-500" />
                                            </button>
                                            <button className="border border-slate-500 p-1 rounded bg-red-50
                                             hover:bg-red-200 hover:cursor-pointer"
                                             onClick={() => handleDelete(diseño.id)}
                                             >
                                                <Trash className="h-5 w-5 text-red-500" />
                                            </button>
                                        </footer>
                                    </div>
                                    
                                ))}
                                
                            </div>
                            
                            </>
                        ) : (
                            <>
                            <div className="max-w-md text-center mx-auto">
                                <h3 className="text-lg font-bold uppercase tracking-tight text-slate-950">
                                    No tienes diseños guardados
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Cuando guardes una personalización, aparecerá aquí para que puedas consultarla más adelante.
                                </p>
                            </div>
                            </>
                        )
                    )
                }
            </section>
        </main>
    )
}