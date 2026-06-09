"use client";

import { useState } from "react";
import Field from "../../components/inputComponent";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { validatePasswordRecovery } from "@/app/lib/validations/authValidation";
import { Suspense } from "react";

export default function ReestablecerPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const searchParams = useSearchParams();

    const [feedback, setFeedback] = useState(null);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            //CONSEGUIMOS EL TOKEN MEDIANTE LA URL
            const token = searchParams.get("token");

            //VERIFICAMOS CONTRASEÑAS ANTES DE ENVIARLAS
            const validation = validatePasswordRecovery(password, confirmPassword)

            if (!validation.valid) {
                setError(validation.message)
                return;
            }

            //LLAMADA AL ENDPOINT
            const res = await axios.post("/api/auth/reestablecerPassword", {
                token,
                password,
                confirmPassword
            });

            if (res.data.status !== 200) {
                setError(res.data.message)

                setTimeout(() => {
                    setFeedback(null)
                }, 5000)
            } else {
                setFeedback(res.data.message);

                setTimeout(() => {
                    setFeedback(null)
                }, 5000)
            }
        } catch (error) {
            setError("Ha ocurrido un error, por favor intenta de nuevo")

            setTimeout(() => {
                setError(null)
            }, 5000)
        }

    }

    return (
        <Suspense fallback={<p>Cargando...</p>}>
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
            <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-8 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                        Nueva contraseña
                    </p>

                    <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                        Crea una nueva contraseña
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        Introduce tu nueva contraseña y confírmala para recuperar el acceso a tu cuenta.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Field label="Nueva contraseña">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
                            placeholder="Introduce tu nueva contraseña"
                            required
                        />
                    </Field>

                    <Field label="Confirmar contraseña">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
                            placeholder="Repite tu contraseña"
                            required
                        />
                    </Field>

                    <button
                        type="submit"
                        className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md active:translate-y-0"
                    >
                        Guardar contraseña
                    </button>
                </form>
                <aside className="mt-4">
                    {feedback && (
                        <p className="text-center rounded-xl border border-green-400 bg-green-100 px-4 py-3 text-sm font-medium text-green-700">
                            {feedback}
                        </p>
                    )}

                    {error && (
                        <p className="text-center rounded-xl border border-red-400 bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
                            {error}
                        </p>
                    )}
                </aside>
                <footer className="text-center flex justify-center mt-5 underline">
                    <Link
                        href="/auth/login">
                        Iniciar sesión
                    </Link>
                </footer>
            </section>
        </main>
        </Suspense>
    );
}