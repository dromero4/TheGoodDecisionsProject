"use client"

import { useState } from "react";
import Field from "../../components/inputComponent";
import axios from "axios";

export default function RecuperarPassword() {
    const [email, setEmail] = useState("");

    const [feedback, setFeedback] = useState(null);
    const [error, setError] = useState(null)

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const res = await axios.post("api/auth/recuperarPassword", {
                email
            });

            if (res.data.status !== 200) {
                console.log("error")
                setError(res.data.message);

                setTimeout(() => {
                    setError(null)
                }, 5000)
            } else {
                setFeedback(res.data.message);

                setTimeout(() => {
                    setFeedback(null)
                }, 5000)
            }
        } catch (error) {
            console.error("Ha habido un error inesperado", error)
        }
    }

    return (
        <>
            <main className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
                <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="mb-8 text-center">
                        <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">
                            Recuperación de cuenta
                        </p>

                        <h1 className="mt-3 text-2xl font-black tracking-tight text-slate-950">
                            Recupera tu contraseña
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            Introduce tu email y te enviaremos un enlace para crear una nueva contraseña.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Field label="Email">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
                                placeholder="tu@email.com"
                                required
                            />
                        </Field>

                        <button
                            type="submit"
                            className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md active:translate-y-0"
                        >
                            Enviar enlace
                        </button>
                    </form>

                    <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs leading-5 text-slate-500">
                            Si el email está registrado, recibirás un enlace de recuperación. Revisa también la carpeta de spam.
                        </p>
                    </div>

                    <aside className="mt-4">
                        {feedback && (
                            <p className="animate-slide-in-bottom transition-all fixed left-1/2 bottom-50 z-9999 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800 shadow-2xl">
                                {feedback}
                            </p>
                        )}

                        {error && (
                            <p className="animate-slide-in-bottom transition-all fixed left-1/2 bottom-50 z-9999 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800 shadow-2xl">
                                {error}
                            </p>
                        )}
                    </aside>

                </section>
            </main>

        </>
    );
}