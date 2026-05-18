"use client";

import axios from "axios";
import AccountNavbar from "../account-components/account-navbar";
import Header from "../account-components/header";
import { useEffect, useState } from "react";

export default  function MyDesigns() {

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
                        <p>Cargando diseños...</p>
                    ) : (
                        diseños.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                                {diseños.map((diseño) => (
                                    <div key={diseño.id} className="bg-white rounded-lg shadow-md p-4">
                                        <div>
                                            Imagen
                                        </div>
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