
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/use-admin";

const navItems = [
    { href: "/demo", label: "DEMO TIME" },
    { href: "/contact", label: "COMMUNICATION" },
    { href: "/artist", label: "ARTIST" },
    { href: "/releases", label: "RELEASES" },
    { href: "/playlist", label: "PLAYLISTS" },
];

export function Navigation() {
    const pathname = usePathname();
    const { isAdmin } = useAdmin();

    const handleLinkClick = () => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('trigger-glitch', { detail: { type: 'secondary' } }));
        }
    };

    return (
        <div className="flex items-center space-x-8">
            {isAdmin && (
                 <Link
                    href="/dashboard"
                    onClick={handleLinkClick}
                    className={cn(
                        "nav-link glow-on-hover",
                        pathname === "/dashboard" && "active"
                    )}
                >
                    DASHBOARD
                </Link>
            )}
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={cn(
                        "nav-link glow-on-hover",
                        pathname === item.href && "active"
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </div>
    );
}
