"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { authClient } from "@/src/lib/auth-client";
import Logo from "../../../../public/logo/logo.png";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
];

export default function Header() {
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { data: session, isPending: loading } = authClient.useSession();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    function handleLogin() {
        router.push("/login");
    }

    function handleRegister() {
        router.push("/register");
    }

    async function handleLogout() {
        await authClient.signOut({
            fetchOptions: { onSuccess: () => { window.location.href = "/"; } },
        });
    }

    function AuthButtons({ mobile = false }: { mobile?: boolean }) {
        if (loading) {
            return (
                <div className={clsx(
                    "flex gap-3 animate-pulse",
                    mobile ? "flex-col" : "items-center"
                )}>
                    <div className="h-8 w-16 rounded-lg bg-gray-100" />
                    <div className="h-8 w-24 rounded-lg bg-gray-100" />
                </div>
            );
        }

        if (session) {
            const displayName = session.user.name || session.user.email;
            return (
                <>
                    <Link
                        href="/profile"
                        onClick={() => setMobileOpen(false)}
                        className={clsx(
                            "font-medium text-gray-700 hover:text-black transition-colors duration-200",
                            mobile ? "w-full px-5 py-2.5 text-sm text-center" : "px-4 py-2"
                        )}
                    >
                        {displayName}
                    </Link>
                    <button
                        onClick={() => { setMobileOpen(false); handleLogout(); }}
                        className={clsx(
                            "btn-gradient duration-200 cursor-pointer",
                            mobile ? "w-full px-5 py-2.5 text-sm text-center" : "px-5 py-2"
                        )}
                    >
                        Logout
                    </button>
                </>
            );
        }

        return (
            <>
                <button
                    onClick={() => { setMobileOpen(false); handleLogin(); }}
                    className={clsx(
                        "text-gray-700 hover:text-black font-medium transition-colors duration-200 cursor-pointer",
                        mobile ? "w-full px-5 py-2.5 text-sm text-center" : "px-5 py-2"
                    )}
                >
                    Login
                </button>
                <button
                    onClick={() => { setMobileOpen(false); handleRegister(); }}
                    className={clsx(
                        "btn-gradient duration-200 cursor-pointer",
                        mobile ? "w-full px-5 py-2.5 text-sm text-center" : "px-5 py-2"
                    )}
                >
                    Register
                </button>
            </>
        );
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white">
            <div className={clsx("transition-shadow duration-300", scrolled && "shadow-[0_2px_10px_rgba(0,0,0,0.12)]")}>
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <Image src={Logo} alt="JobSpring Logo" width={200} height={200} />
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="group relative px-4 py-1 text-md font-medium text-black rounded-xl transition-all duration-200 hover:text-black"
                            >
                                {link.label}
                                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 w-0 rounded-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-300 group-hover:w-3/4" />
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-3 shrink-0">
                        <AuthButtons />
                    </div>

                    <button
                        id="mobile-menu-toggle"
                        aria-label="Toggle mobile menu"
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen((v) => !v)}
                        className="md:hidden flex flex-col gap-1.5 p-2 rounded-xl transition-colors duration-200"
                    >
                        <span className={`block h-0.5 w-5 rounded-full bg-black transition-all duration-300 ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
                        <span className={`block h-0.5 w-5 rounded-full bg-black transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
                        <span className={`block h-0.5 w-5 rounded-full bg-black transition-all duration-300 ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
                    </button>
                </div>

                <div className={`md:hidden absolute top-full left-0 w-full bg-white shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"}`}>
                    <nav className="flex flex-col gap-1 px-4 pb-4 pt-2 border-t border-gray-100">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="px-4 py-2.5 text-sm font-medium text-black rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-gray-100">
                            <AuthButtons mobile />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}