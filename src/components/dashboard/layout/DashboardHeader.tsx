"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { authClient } from "@/src/lib/auth-client";
import Sidebar from "./Sidebar";
import type { Role } from "@/src/constants/menu";

type Props = {
    role: Role;
    user: {
        name?: string | null;
        email: string;
        image?: string | null;
    };
};

export default function DashboardHeader({ role, user }: Props) {
    const router = useRouter();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/sign-in");
        router.refresh();
    };

    const initials = (user.name || user.email)
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <>
            <header className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
                <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    aria-label="Open menu"
                    className="cursor-pointer rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <div className="hidden lg:block" />
                <div className="relative" ref={menuRef}>
                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        aria-label="Account menu"
                        className="cursor-pointer rounded-full ring-2 ring-[#14533f]/30 focus-visible:outline-2 focus-visible:outline-[#696CFF]"
                    >
                        {user.image ? (
                            <Image
                                key={user.image}
                                src={user.image}
                                alt={user.name || "User"}
                                width={48}
                                height={48}
                                className="h-11 w-11 rounded-full object-cover"
                            />
                        ) : (
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#14533f] text-sm font-semibold text-white">
                                {initials}
                            </span>
                        )}
                    </button>

                    {menuOpen && (
                        <div
                            role="menu"
                            className="absolute right-0 z-30 mt-2 w-56 rounded-xl bg-white p-2 shadow-lg ring-1 ring-black/5"
                        >
                            <div className="border-b border-gray-100 px-3 pb-2 pt-1">
                                <p className="truncate text-sm font-semibold text-gray-900">
                                    {user.name || "Account"}
                                </p>
                                <p className="truncate text-xs text-gray-500">{user.email}</p>
                            </div>
                            <button
                                type="button"
                                role="menuitem"
                                onClick={handleSignOut}
                                className="mt-1 flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {drawerOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setDrawerOpen(false)}
                        aria-hidden="true"
                    />
                    <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
                        <button
                            type="button"
                            onClick={() => setDrawerOpen(false)}
                            aria-label="Close menu"
                            className="absolute right-3 top-4 cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <Sidebar role={role} onNavigate={() => setDrawerOpen(false)} />
                    </aside>
                </div>
            )}
        </>
    );
}