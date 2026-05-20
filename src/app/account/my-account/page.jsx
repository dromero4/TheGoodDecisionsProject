"use client";

import { useState } from "react";
import AccountNavbar from "../account-components/account-navbar";
import Header from "../account-components/header";
import axios from "axios";
import { useEffect } from "react";
import Link from "next/link";


export default function Account() {
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [ordersQty, setOrdersQty] = useState(0);
    const [designsQty, setDesignsQty] = useState(0);

    useEffect(() => {
        async function getRecentOrders() {
            try {
                const res = await axios.get("/api/me/my-orders/orders");
                setRecentOrders(res.data);
            } catch (error) {
                console.error("Error cargando pedidos recientes", error)
            } finally {
                setLoading(false)
            }
        }

        getRecentOrders()
    }, [])

    useEffect(() => {
        async function getOrders() {

            try {
                const res = await axios.get("/api/me/my-orders")
                setOrdersQty(res.data.length);
            } catch (error) {
                console.error("No se ha podido mostrar el numero de pedidos")
            }
        }

        getOrders();
    }, []);

    useEffect(() => {
        async function getDesigns() {
            try {
                const res = await axios.get("/api/me/my-designs")
                setDesignsQty(res.data.length);
            } catch (error) {
                console.error("No se han podido mostrar el numero de diseños guardados")
            }
        }
        getDesigns()
    }, [])
    return (
        <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
            <section className="mx-auto max-w-5xl">
                <AccountNavbar />
                <Header title="Mi cuenta" subtitle="Mi cuenta" />
            </section>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 max-w-5xl mx-auto">
                <section className="text-center rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
                        Pedidos recientes
                    </span>
                    <hr className="opacity-10" />
                    {
                        loading ? (
                            <p>Cargando pedidos...</p>
                        ) : (
                            recentOrders.length !== 0 ? (
                                <>
                                    <table className="my-3 w-full overflow-hidden text-sm">
                                        <tbody className="divide-y divide-slate-100">
                                            {recentOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="transition hover:bg-slate-50"
                                                >
                                                    <td className="max-w-32 truncate px-3 py-3 text-left font-semibold text-slate-900">
                                                        {order.id.length > 10
                                                            ? `#${order.id.slice(0, 10)}...`
                                                            : `#${order.id}`}
                                                    </td>

                                                    <td className="whitespace-nowrap px-3 py-3 text-left text-slate-500">
                                                        {new Date(order.createdAt).toLocaleDateString("es-ES", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                        })}
                                                    </td>

                                                    <td className="whitespace-nowrap px-3 py-3 text-right font-semibold text-slate-900">
                                                        {order.cartTotal?.toFixed(2)} €
                                                    </td>

                                                    <td className="px-3 py-3 text-right">
                                                        <span
                                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${order.paymentStatus === "Pagado"
                                                                ? "bg-emerald-100 text-emerald-700"
                                                                : "bg-amber-100 text-amber-700"
                                                                }`}
                                                        >
                                                            {order.paymentStatus}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <Link
                                        className="border rounded-lg border-slate-300 px-2 py-1 text-sm"
                                        href={"/account/my-orders"}
                                    >
                                        Ver todos los pedidos
                                    </Link>
                                </>
                            ) : (
                                <p className="text-sm font-medium mt-2 opacity-50">No tienes pedidos aún</p>
                            )
                        )
                    }
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
                    <div className="text-center">
                        <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
                            Resumen de actividad
                        </span>

                    </div>

                    <hr className="my-4 border-slate-200" />

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="flex items-center gap-3 rounded-full bg-slate-50 px-4 py-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                                <span className="text-sm font-medium text-slate-500">
                                    Cargando...
                                </span>
                            </div>
                        </div>
                    ) : ordersQty !== 0 ? (
                        <div className="space-y-3">
                            <div className="rounded-2xl bg-slate-50 p-4 text-left">
                                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                    Pedidos totales
                                </p>
                                <p className="mt-2 text-3xl font-bold text-slate-950">
                                    {ordersQty}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                            <p className="text-sm font-semibold text-slate-900">
                                Sin actividad todavía
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Cuando hagas tu primer pedido, aparecerá aquí.
                            </p>
                        </div>
                    )}
                </section>

                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
                    <div className="text-center">
                        <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
                            Tus diseños guardados
                        </span>
                    </div>

                    <hr className="my-4 border-slate-200" />

                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="flex items-center gap-3 rounded-full bg-slate-50 px-4 py-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                                <span className="text-sm font-medium text-slate-500">
                                    Cargando...
                                </span>
                            </div>
                        </div>
                    ) : designsQty !== 0 ? (
                        <div className="space-y-3">
                            <div className="rounded-2xl bg-slate-50 p-4 text-left">
                                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                                    Diseños totales
                                </p>
                                <p className="mt-2 text-3xl font-bold text-slate-950">
                                    {designsQty}
                                </p>
                            </div>

                            <div className=" rounded-2xl text-left">
                                <Link
                                        className="border rounded-lg border-slate-300 px-2 py-1 text-sm "
                                        href={"/account/my-designs"}
                                    >
                                        Ver todos los diseños
                                    </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                            <p className="text-sm font-semibold text-slate-900">
                                Sin diseños todavía
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Cuando guardes tu primer diseño, aparecerá aquí.
                            </p>
                        </div>
                    )}
                </section>
            </div>

        </main>
    )
}