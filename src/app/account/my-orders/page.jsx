"use client"
import { useEffect, useState } from "react";
import AccountNavbar from "../account-components/account-navbar";
import Header from "../account-components/header";
import axios from "axios";
import { Trash } from "lucide-react";

export default function Pedidos() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados de los filtros
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const [dateOrder, setDateOrder] = useState("descenso");

  const [feedback, setFeedback] = useState(null);

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

  async function handleDelete(orderId) {
    try {
      const res = await axios.delete(`/api/me/my-orders/${orderId}`);
      if (res.status === 200) {
        // Eliminar el pedido de la lista localmente para actualizar la UI
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
        setFeedback("Pedido eliminado correctamente.");

        setTimeout(() => {
                setFeedback(null);
            }, 5000);
      }
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
      setFeedback("Error al eliminar el pedido.");

      setTimeout(() => {
                setFeedback(null);
            }, 5000);
    }
  }

  async function handleResendEmail(orderId) {
    try {
      const res = await axios.post(`/api/me/my-orders/${orderId}/resend-email`);
      if (res.status === 200) {
        setFeedback("Correo reenviado correctamente.");
      }

      setTimeout(() => {
        setFeedback(null);
      }, 5000);
    } catch (error) {
      console.error("Error al reenviar el correo:", error);
      setFeedback("Error al reenviar el correo.");

      setTimeout(() => {
        setFeedback(null);
      }, 5000);
    }
  }

  // Filtros aplicados a los pedidos
  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase();

    const matchesSearch = 
      order.id.toLowerCase().includes(searchText) ||
      order.paymentStatus.toLowerCase().includes(searchText);

    const matchesStatus = 
      statusFilter === "todas" || order.paymentStatus.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  })
  .sort((a, b) => {
    const dateA = newDate(a.createdAt);
    const dateB = newDate(b.createdAt);

    if(dateOrder === "ascenso") {
      return dateA - dateB;
    }

    return dateB - dateA;
  })


  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="relative">
        {feedback && (
          <div className={`animate-slide-in-top border border-slate-200 absolute shadow-lg left-1/2 -translate-x-1/2 mb-4 rounded-xl px-4 py-3 text-sm ${feedback.includes("correctamente") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {feedback}
          </div>
        )}
      </section>
      <section className="mx-auto max-w-5xl">

        <AccountNavbar />
        <Header title="Historial de pedidos" subtitle="Mis pedidos" />
      </section>
      <section className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            {/* Filtros */}
            <div className="flex gap-5 mb-5">
              <input 
              type="search" 
              placeholder="Buscar pedidos..."
              id="buscar-pedidos"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="rounded-full border border-slate-900 p-2 text-sm" 
              />

              <select 
              name="filtrar-por-estado" 
              id="filtrar-por-estado"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-full border border-slate-900 p-2 text-sm"
              >
                <option value="estado" disabled>Estado</option>
                <option value="todas">Todas las opciones</option>
                <option value="pendiente">Pendiente</option>
                <option value="pagado">Pagado</option>
              </select>

              <select 
              name="filtrar-por-fecha" 
              id="filtrar-por-fecha"
              value={dateOrder}
              onChange={(event) => setDateOrder(event.target.value)}
              className="rounded-full border border-slate-900 p-2 text-sm"
              >
                <option value="fecha" disabled>Fecha</option>
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
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                No hay pedidos que mostrar.
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
                      filteredOrders.map((order) => (
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
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${order.paymentStatus === "Pagado"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                                }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button 
                              className="rounded-xl border border-slate-300 
                              bg-white px-4 py-2 text-sm font-semibold text-slate-700 
                              transition hover:border-slate-400 hover:bg-slate-50"
                              onClick={() => handleResendEmail(order.id)}>
                                Reenviar correo
                              </button>

                              <button
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-white text-red-500 transition hover:bg-red-50 hover:text-red-600"
                                title="Eliminar pedido"
                                onClick={() => handleDelete(order.id)}
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