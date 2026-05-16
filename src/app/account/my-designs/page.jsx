import AccountNavbar from "../account-components/account-navbar";
import Header from "../account-components/header";

export default function MyDesigns() {
    return (
        <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-950">
            <section className="mx-auto max-w-5xl">
                <AccountNavbar />
                <Header title="Gestiona tus diseños" subtitle="Mis diseños" />
            </section>
        </main>
    )
}