"use client";

import { useState } from "react";

export default function ProductAccordion({ title, children }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="border border-black rounded-md mt-2">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center px-4 py-3 font-bold uppercase text-sm"
            >
                {title}

                <span
                    className={`transition-transform ${open ? "rotate-180" : ""
                        }`}
                >
                    ▾
                </span>
            </button>

            {open && (
                <div className="px-4 pb-4 text-sm">
                    <ul className="list-disc pl-4 space-y-1">
                        {typeof children === "string" &&
                            children
                                .split("\n")
                                .filter(Boolean)
                                .map((line, i) => (
                                    <li key={i}>{line}</li>
                                ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
