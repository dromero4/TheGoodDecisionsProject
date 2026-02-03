"use client";

import { useState } from "react";

import { Search } from "lucide-react";
import { ArrowDown } from "lucide-react";
import { FlyoutMenu } from "../FlyoutMenu";

export default function TopFilters() {
    const [streetWear, setStreetWear] = useState(null)
    const [sportWear, setSportWear] = useState(null)

    return (
        <main className="flex flex-row gap-10 items-center justify-center sticky top-0 z-30 py-4 backdrop-blur-md bg-linear-to-b from-white/90 via-white/60 to-transparent border-black/5">
            {/* Filters (Streetwear / Sportwear) */}
            <FlyoutMenu />

            
            {/* Search */}
            <div className="absolute right-21">
                <div className="flex border rounded-full py-1">
                    <Search className="pl-2" />

                    <input type="text"
                        name="search-robe" id="search-robe"
                        className="border-none focus:ring-0 focus:outline-none pl-2 w-auto text-sm"
                        placeholder="Type in something" />
                </div>
            </div>
        </main>
    )
}