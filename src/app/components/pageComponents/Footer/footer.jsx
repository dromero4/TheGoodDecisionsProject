export default function Footer() {
    return (
        <footer className="bg-[#2b00f9] text-white py-4 mt-4">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} The Good Decisions. Todos los derechos reservados.</p>
            </div>
        </footer>
    )
}