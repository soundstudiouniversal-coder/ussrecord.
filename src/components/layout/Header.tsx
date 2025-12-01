
"use client"

import Link from "next/link";
import { Navigation } from "./Navigation";
import { ModeToggle } from "../ModeToggle";
import { AdminToggle } from "../AdminToggle";
import { HologramText } from "../HologramText";

export function Header() {
    const handleTitleClick = () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('trigger-glitch'));
        }
    };

    const handleMouseEnter = () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cursor-hover-start'));
        }
    }

    const handleMouseLeave = () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('cursor-hover-end'));
        }
    }

    return (
        <header className="text-center py-4 md:py-8 mb-12">
            <Link 
                href="/" 
                onClick={handleTitleClick} 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="inline-block cursor-pointer glow-on-hover group"
            >
                 <HologramText text="UNIVERSAL SOUND STUDIO" as="h1" className="text-3xl md:text-5xl font-bold uppercase tracking-widest" />
                <span className="block italic text-sm opacity-70 mt-2 tracking-[0.3em] lowercase">The universe is next level artist</span>
            </Link>

            <nav className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mt-8 text-lg">
                <Navigation />
                <div className="flex items-center space-x-4">
                    <ModeToggle />
                    <AdminToggle />
                </div>
            </nav>
        </header>
    );
}
