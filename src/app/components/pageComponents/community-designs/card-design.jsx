import axios from "axios";
import { Heart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function CardDesign({ design }) {
    const [likes, setLikes] = useState(design.likesCount || 0)
    const [hasLiked, setHasLiked] = useState(design.hasLiked || false)

    async function handleLike(id) {
        if (hasLiked) {
            setLikes((prevLikes) => prevLikes - 1);
            setHasLiked(false);

            try {
                const res = await axios.delete(`/api/me/${id}`);

                setLikes(res.data.likesCount)
                setHasLiked(res.data.hasLiked)
            } catch (error) {
                console.error("Ha habido un error", error)
            }
        } else {

            setLikes((prevLikes) => prevLikes + 1);
            setHasLiked(true);
            try {
                const res = await axios.post(`/api/me/${id}`);

                setLikes(res.data.likesCount)
                setHasLiked(res.data.hasLiked)
            } catch (error) {
                console.error("Ha habido un error", error)
            }
        }
    }

    return (
        <article
            key={design.id}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
            <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
                {design.previewImage ? (
                    <Image
                        src={design.previewImage}
                        alt={design.name}
                        fill
                        unoptimized
                        className="object-contain p-3 transition duration-300 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                        Sin preview
                    </div>
                )}
            </div>

            <div className="border-t border-slate-100 p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-400">
                            {new Date(design.createdAt).toLocaleDateString("es-ES", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </p>

                        <h3 className="mt-1 truncate text-lg font-bold uppercase tracking-tight text-slate-950">
                            {design.name}
                        </h3>

                        <p className="mt-1 truncate text-sm text-slate-500">
                            {design.category || "Sin categoría"} ·{" "}
                            {design.size || design.Size || "-"} x{" "}
                            {design.quantity || design.Quantity || "-"}
                        </p>
                    </div>

                    <div className="pointer-events-none shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {likes} likes
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <span className="pointer-events-none rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Público
                    </span>

                    <button className=" hover:cursor-pointer rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
                        Ver diseño
                    </button>
                </div>
                <div className="flex relative">

                    <p className="mt-2 text-sm opacity-60">
                        {design.user.email}
                    </p>
                    <button
                        className="absolute right-0 mt-2 "
                        onClick={() => handleLike(design.id)}
                    >
                        <Heart
                            
                            className={hasLiked ? "fill-red-500 text-red-500 hover:cursor-pointer hover:scale-105 transition-all" : "fill-transparent text-slate-500 hover:cursor-pointer hover:scale-105 transition-all"}

                        />

                    </button>
                </div>
            </div>
        </article>
    )
}