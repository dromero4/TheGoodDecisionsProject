import { ChevronDown } from "lucide-react"
import { useState } from "react"

export function FlyoutMenu() {
    const [isOpenStreetwear, setIsOpenStreetwear] = useState(false);
    const [isOpenSportwear, setIsOpenSportwear] = useState(false);

    function handleStreetwear() {
        setIsOpenStreetwear(!isOpenStreetwear);
        setIsOpenSportwear(false);
    }

    function handleSportwear(){
        setIsOpenSportwear(!isOpenSportwear)
        setIsOpenStreetwear(false);
    }

    return (
        <div>

            <nav className="flex gap-5">
                <div className="flex text-sm gap-1">
                    <button
                        className="uppercase flex items-center cursor-pointer"
                        onClick={handleStreetwear}
                    >
                        Streetwear
                        <ChevronDown width={17} />
                    </button>
                </div>
                <div className="flex text-sm gap-1">
                    <button
                        className="uppercase flex items-center cursor-pointer"
                        onClick={handleSportwear}
                    >
                        Sportwear
                        <ChevronDown width={17} />
                    </button>
                </div>
            </nav>
            {
                isOpenStreetwear && (
                    <section
                        className="
                              absolute z-30 mt-2 w-56 overflow-hidden rounded-2xl
                              border border-black/10 bg-white/90 backdrop-blur-md
                              shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]
                            ">
                        <a
                            href="#"
                            className="
                              block px-4 py-2.5 text-left text-sm font-medium text-black/80
                              hover:bg-black/4 hover:text-black
                              transition-all
                              focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:pl-5
                            ">
                            Tees
                        </a>
                        <a href="#" className="block px-4 py-2.5 text-left text-sm font-medium text-black/80 hover:bg-black/4 hover:text-black transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:pl-5">
                            Hoodies
                        </a>
                        <a href="#" className="block px-4 py-2.5 text-left text-sm font-medium text-black/80 hover:bg-black/4 hover:text-black transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:pl-5">
                            Pants & shorts
                        </a>
                        <a href="#" className="block px-4 py-2.5 text-left text-sm font-medium text-black/80 hover:bg-black/4 hover:text-black transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:pl-5">
                            Polos
                        </a>
                        <a href="#" className="block px-4 py-2.5 text-left text-sm font-medium text-black/80 hover:bg-black/4 hover:text-black transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:pl-5">
                            Jackets
                        </a>
                        <a href="#" className="block px-4 py-2.5 text-left text-sm font-medium text-black/80 hover:bg-black/4 hover:text-black transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:pl-5">
                            Shirts
                        </a>
                        <a href="#" className="block px-4 py-2.5 text-left text-sm font-medium text-black/80 hover:bg-black/4 hover:text-black transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:pl-5">
                            Swimwear
                        </a>
                        <a href="#" className="block px-4 py-2.5 text-left text-sm font-medium text-black/80 hover:bg-black/4 hover:text-black transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:pl-5">
                            Caps & hats
                        </a>
                    </section>
                )
            }
            {
                isOpenSportwear && (
                    <section
                        className="
                              absolute z-30 mt-2 w-56 overflow-hidden rounded-2xl
                              border border-black/10 bg-white/90 backdrop-blur-md
                              shadow-[0_10px_30px_-12px_rgba(0,0,0,0.25)]
                            ">
                        <a
                            href="#"
                            className="
                              block px-4 py-2.5 text-left text-sm font-medium text-black/80
                              hover:bg-black/4 hover:text-black
                              transition-all
                              focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:pl-5
                            ">
                            Tees
                        </a>
                        <a href="#" className="block px-4 py-2.5 text-left text-sm font-medium text-black/80 hover:bg-black/4 hover:text-black transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:pl-5">
                            Hoodies
                        </a>
                        <a href="#" className="block px-4 py-2.5 text-left text-sm font-medium text-black/80 hover:bg-black/4 hover:text-black transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:pl-5">
                            Pants & shorts
                        </a>
                        <a href="#" className="block px-4 py-2.5 text-left text-sm font-medium text-black/80 hover:bg-black/4 hover:text-black transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:pl-5">
                            Polos
                        </a>
                        <a href="#" className="block px-4 py-2.5 text-left text-sm font-medium text-black/80 hover:bg-black/4 hover:text-black transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:pl-5">
                            Jackets
                        </a>
                        <a href="#" className="block px-4 py-2.5 text-left text-sm font-medium text-black/80 hover:bg-black/4 hover:text-black transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 hover:pl-5">
                            Sport sets
                        </a>
                    </section>
                )
            }

        </div>
    )
}