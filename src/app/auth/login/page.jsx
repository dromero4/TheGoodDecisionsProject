"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Field from "../../components/inputComponent";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "No se ha podido iniciar sesión.");
        return;
      }

      router.push("/account/my-account");
      router.refresh();
    } catch {
      setError("Error inesperado iniciando sesión.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-950">
      <section className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <p className="mb-1.5 text-sm text-slate-500 max-w-20 border border-slate-400 rounded-2xl">
            <button
            className="text-slate-500 hover:text-slate-700"
            onClick={() => router.push("/")}
            >
              Volver
            </button>
          </p>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Área cliente
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Iniciar sesión
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Accede a tu perfil para revisar y editar tus datos de entrega.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Email">
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              placeholder="tu@email.com"
              required
            />
          </Field>

          <Field label="Contraseña">
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-900"
              placeholder="Tu contraseña"
              required
            />
          </Field>


          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
            {loading ? "Entrando..." : "Entrar"}
          </button>
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          ¿No tienes cuenta?{" "}
          <Link href="/auth/register" className="font-semibold text-slate-950 underline">
            Crear cuenta
          </Link>
        </p>
        <p className="mt-3 text-center text-sm text-slate-500">
          Has olvidado la contraseña?
          <Link href="/auth/recuperar-password" className="font-semibold text-slate-950 underline ml-1">
            Recupérala!
          </Link>
        </p>
      </section>
    </main>
  );
}

