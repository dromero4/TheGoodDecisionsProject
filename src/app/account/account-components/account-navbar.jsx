import Link from "next/link";

export default function AccountNavbar() {
    return (
        <section>
            <div className="mb-6 flex gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
                <Link href="/account/">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 hover:text-gray-900">Mi cuenta</span>
                </Link>
                <Link href="/account/my-orders">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 hover:text-gray-900">Mis pedidos</span>
                </Link>
                <Link href="/account/community-designs">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 hover:text-gray-900">Diseños de la comunidad</span>
                </Link>
                <Link href="/account/my-designs">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 hover:text-gray-900">Mis diseños</span>
                </Link>
                <Link href="/account/account-settings">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 hover:text-gray-900">Ajustes de la cuenta</span>
                </Link>                
            </div>
        </section>
    )
}