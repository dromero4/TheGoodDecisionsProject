"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EMPTY_FORM = {
  name: "",
  phone: "",
  address: {
    fullName: "",
    phone: "",
    street: "",
    number: "",
    floorDoor: "",
    postalCode: "",
    city: "",
    province: "",
    country: "Spain",
    additionalInfo: "",
  },
};

export default function AccountPage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  async function loadUser() {
    setLoading(true);

    try {
      const response = await fetch("/api/me");

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "No se ha podido cargar el perfil.");
        return;
      }

      const loadedUser = data.user;
      setUser(loadedUser);

      setForm({
        name: loadedUser.name || "",
        phone: loadedUser.phone || "",
        address: {
          fullName: loadedUser.address?.fullName || "",
          phone: loadedUser.address?.phone || "",
          street: loadedUser.address?.street || "",
          number: loadedUser.address?.number || "",
          floorDoor: loadedUser.address?.floorDoor || "",
          postalCode: loadedUser.address?.postalCode || "",
          city: loadedUser.address?.city || "",
          province: loadedUser.address?.province || "",
          country: loadedUser.address?.country || "Spain",
          additionalInfo: loadedUser.address?.additionalInfo || "",
        },
      });
    } catch {
      setError("Error inesperado cargando el perfil.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateAddressField(field, value) {
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  }

  async function handleSave(e) {
    e.preventDefault();

    setSaving(true);
    setError("");
    setFeedback("");

    try {
      const response = await fetch("/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "No se ha podido guardar el perfil.");
        return;
      }

      setUser(data.user);
      setFeedback("Perfil actualizado correctamente.");
    } catch {
      setError("Error inesperado guardando el perfil.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-950">
        <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">Cargando perfil...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Mi cuenta
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              Perfil de usuario
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {user?.email}
            </p>
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
              onClick={handleLogout}
              className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Datos personales
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Información básica de contacto del cliente.
            </p>

            <div className="mt-6 space-y-4">
              <Field label="Nombre">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  placeholder="Nombre del cliente"
                />
              </Field>

              <Field label="Teléfono">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  placeholder="+34 600 000 000"
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">
              Dirección de entrega
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Esta dirección se usará como referencia para futuros pedidos.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Nombre completo">
                <input
                  type="text"
                  value={form.address.fullName}
                  onChange={(e) => updateAddressField("fullName", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  placeholder="Nombre y apellidos"
                />
              </Field>

              <Field label="Teléfono de entrega">
                <input
                  type="tel"
                  value={form.address.phone}
                  onChange={(e) => updateAddressField("phone", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  placeholder="+34 600 000 000"
                />
              </Field>

              <Field label="Calle">
                <input
                  type="text"
                  value={form.address.street}
                  onChange={(e) => updateAddressField("street", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  placeholder="Calle / Avenida"
                />
              </Field>

              <Field label="Número">
                <input
                  type="text"
                  value={form.address.number}
                  onChange={(e) => updateAddressField("number", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  placeholder="13"
                />
              </Field>

              <Field label="Piso / puerta / local">
                <input
                  type="text"
                  value={form.address.floorDoor}
                  onChange={(e) => updateAddressField("floorDoor", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  placeholder="Local 5, 2º 1ª..."
                />
              </Field>

              <Field label="Código postal">
                <input
                  type="text"
                  value={form.address.postalCode}
                  onChange={(e) => updateAddressField("postalCode", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  placeholder="08000"
                />
              </Field>

              <Field label="Ciudad">
                <input
                  type="text"
                  value={form.address.city}
                  onChange={(e) => updateAddressField("city", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  placeholder="Barcelona"
                />
              </Field>

              <Field label="Provincia">
                <input
                  type="text"
                  value={form.address.province}
                  onChange={(e) => updateAddressField("province", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  placeholder="Barcelona"
                />
              </Field>

              <Field label="País">
                <input
                  type="text"
                  value={form.address.country}
                  onChange={(e) => updateAddressField("country", e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                  placeholder="Spain"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Información adicional">
                  <textarea
                    value={form.address.additionalInfo}
                    onChange={(e) =>
                      updateAddressField("additionalInfo", e.target.value)
                    }
                    rows={4}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
                    placeholder="Indicaciones de entrega, horario, comentarios..."
                  />
                </Field>
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {feedback && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {feedback}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </section>
        </form>
      </section>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}