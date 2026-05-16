"use client"
import AccountNavbar from "../account-components/account-navbar";
import Header from "../account-components/header";

export default function Pedidos() {
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
          <div className="mt-3">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID de pedido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Unidades</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Precio final</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {/* Filas de la tabla */}
                { /* Aquí se mapearían los pedidos del usuario para mostrar cada uno en una fila */ }
                {/* Si no hay ninguno, que haya un mensaje indicando que no hay pedidos */ }
              </tbody>
            </table>
          </div>
        </div>
        
      </section>

    </main>
  )
}