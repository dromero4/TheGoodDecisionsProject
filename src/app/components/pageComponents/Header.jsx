import Image from "next/image";


import logo from '../../../../public/images/logo.svg'
import { UserRound } from "lucide-react";

export default function Header() {
    return (
        <>
        
            <header className="flex justify-center items-center flex-col">
                <Image
                    src={logo}
                    alt="Logo"
                    width={300}
                    height="auto"
                    className="mt-5"></Image>
                <h1 className="xl:text-5xl sm:text-3xl mb-10"><span className="font-bold">Customization</span> Market</h1>
            </header>
            <aside className="absolute top-0 right-0 m-6">
                <UserRound />
            </aside>
            
            <main className="text-center mb-5">
                <hr />
                <p className="uppercase my-3 font-bold">Create your collection now!</p>
                <hr />
            </main>
        </>
    )
}