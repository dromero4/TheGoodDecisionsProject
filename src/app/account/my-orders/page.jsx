"use client"
import { useEffect, useState } from "react";
import AccountNavbar from "../account-components/account-navbar";
import Header from "../account-components/header";
import axios from "axios";
import { Trash } from "lucide-react";

export default function Pedidos() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Momento de hacer fetch a /api/me/my-orders para obtener los pedidos.
  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await axios.get("/api/me/my-orders");
        const orders = response.data;

        setOrders(orders);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar los pedidos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-5xl">

        <AccountNavbar />
        <Header title="Historial de pedidos" subtitle="Mis pedidos" />
      </section>
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            {/* Filtros */}
            <div className="flex gap-5 mb-5">
              <input type="search" placeholder="Buscar pedidos..."
                id="buscar-pedidos"
                className="rounded-full border border-slate-900 p-2 text-sm" />

              <select name="filtrar-por-estado" id="filtrar-por-estado"
                className="rounded-full border border-slate-900 p-2 text-sm"
                defaultValue={"todas"}>
                <option value="todas" disabled>Estado</option>
                <option value="todas">Todas las opciones</option>
                <option value="en-proceso">En proceso</option>
                <option value="completado">Completado</option>
              </select>

              <select name="filtrar-por-fecha" id="filtrar-por-fecha"
                className="rounded-full border border-slate-900 p-2 text-sm"
                defaultValue={"todas"}>
                <option value="todas" disabled>Fecha</option>
                <option value="ascenso">Asc</option>
                <option value="descenso">Desc</option>
              </select>
            </div>
            <hr className="opacity-10" />
          </div>
          {/* tabla */}
          {
            loading ? (
              <div className="flex items-center justify-center py-10">
                <svg className="animate-spin h-8 w-8 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                No tienes pedidos aún.
              </div>
            ) : (
              <div className="mt-3">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID de pedido</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Precio final</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {
                      orders.map((order) => (
                        <tr
                          key={order.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="max-w-45 truncate px-6 py-4 text-sm font-medium text-slate-900">
                            {order.id}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {new Date(order.createdAt).toLocaleDateString("es-ES")}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                            {order.cartTotal.toFixed(2)} €
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${order.paymentStatus === "paid"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                                }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                                Reenviar correo
                              </button>

                              <button
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-white text-red-500 transition hover:bg-red-50 hover:text-red-600"
                                title="Eliminar pedido"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      </section>
    </main>
  )
}