"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { authClient } from "@/src/lib/auth-client";
import Logo from "../../../../public/logo/logo.png";
import {
    User,
    Settings,
    LogOut,
    LayoutDashboard,
    ChevronDown,
} from "lucide-react";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Jobs", href: "/jobs" },
];

const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Profile", href: "/profile", icon: User },
    { label: "Settings", href: "/settings", icon: Settings },
];

function UserAvatar({
    name,
    email,
    userProfile,
    size = 32,
}: {
    name?: string;
    email?: string;
    userProfile?: string | null;
    size?: number;
}) {
    if (userProfile) {
        return (
            <Image
                src={userProfile}
                alt={name || email || "User"}
                width={size}
                height={size}
                className="rounded-full object-cover border border-gray-200"
                style={{ width: size, height: size }}
            />
        );
    }
    return (
        <div
            className="rounded-full bg-gradient-to-tr from-cyan-400 to-green-400 text-white flex items-center justify-center shadow-[0_2px_8px_rgba(7,196,236,0.15)]"
            style={{ width: size, height: size }}
        >
            <User style={{ width: size * 0.55, height: size * 0.55 }} />
        </div>
    );
}

export default function Header() {
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { data: session, isPending: loading } = authClient.useSession();
    const user = session?.user;
    const userProfile = user?.image;

    // Scroll shadow
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close dropdown on outside click / Escape
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setDropdownOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    function handleLogin() {
        setMobileOpen(false);
        router.push("/login");
    }

    function handleRegister() {
        setMobileOpen(false);
        router.push("/register");
    }

    async function handleLogout() {
        setDropdownOpen(false);
        setMobileOpen(false);
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    router.refresh();
                },
            },
        });
    }

    function AuthSkeleton({ mobile = false }: { mobile?: boolean }) {
        return (
            <div className={clsx("flex items-center gap-3 animate-pulse", mobile && "px-4")}>
                <div className={clsx("rounded-full bg-gray-150", mobile ? "h-10 w-10" : "h-9 w-9")} />
                <div className="h-4 w-20 rounded bg-gray-150" />
            </div>
        );
    }

    function AuthButtons({ mobile = false }: { mobile?: boolean }) {
        if (mobile) {
            return (
                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleLogin}
                        className="w-full text-center py-3 text-sm hover:bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer"
                    >
                        Login
                    </button>
                    <button
                        onClick={handleRegister}
                        className="w-full text-center py-3 text-md text-white btn-gradient rounded-xl transition-all duration-200 cursor-pointer shadow-[0_4px_12px_rgba(7,196,236,0.15)]"
                    >
                        Register
                    </button>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-3">
                <button
                    onClick={handleLogin}
                    className="text-gray-700 hover:text-black transition-colors duration-200 cursor-pointer px-4 py-2 text-lg"
                >
                    Login
                </button>
                <button
                    onClick={handleRegister}
                    className="btn-gradient duration-200 cursor-pointer px-5 py-2.5 text-lg shadow-[0_4px_12px_rgba(7,196,236,0.15)] hover:shadow-[0_6px_16px_rgba(7,196,236,0.25)]"
                >
                    Register
                </button>
            </div>
        );
    }

    function DesktopAuth() {
        if (loading) return <AuthSkeleton />;
        if (!user) return <AuthButtons />;

        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer focus:outline-none"
                >
                    <UserAvatar name={user.name} email={user.email} userProfile={userProfile} size={40} />
                    <span className="max-w-[100px] truncate text-lg text-gray-800 hidden lg:inline">
                        {user.name || "User"}
                    </span>
                    <ChevronDown className={clsx("w-4 h-4 text-gray-500 transition-transform duration-200", dropdownOpen && "rotate-180")} />
                </button>

                {dropdownOpen && (
                    <div
                        className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-[0_10px_35px_rgba(0,0,0,0.08)] py-2 z-50 origin-top-right"
                        style={{ animation: "authFadeIn 0.2s ease-out" }}
                    >
                        <div className="px-4 py-2.5 ">
                            <p className="text-lg text-gray-800 truncate">{user.name || "My Account"}</p>
                            <p className="text-sm text-gray-500 truncate mt-0.5">{user.email}</p>
                        </div>

                        <div className="py-1">
                            {menuItems.map(({ label, href, icon: Icon }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-md hover:bg-gray-50 hover:text-black transition-colors duration-150"
                                >
                                    <Icon className="w-4 h-4 text-gray-500" />
                                    <span>{label}</span>
                                </Link>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 my-1" />

                        <div className="px-1.5 py-0.5">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 text-lg text-red-500 hover:bg-red-50 rounded-xl transition-all duration-150 cursor-pointer font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    function MobileAuth() {
        if (loading) return <AuthSkeleton mobile />;
        if (!user) return <AuthButtons mobile />;

        return (
            <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
                    <UserAvatar name={user.name} email={user.email} userProfile={userProfile} size={40} />
                    <div className="truncate">
                        <p className="text-md text-gray-800 truncate">{user.name || "My Account"}</p>
                        <p className="text-md text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-1 mt-1">
                    {menuItems.map(({ label, href, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-lg text-gray-700 hover:bg-gray-50 rounded-xl"
                        >
                            <Icon className="w-4 h-4 text-gray-500" />
                            <span>{label}</span>
                        </Link>
                    ))}
                </div>

                <button
                    onClick={handleLogout}
                    className="mt-2 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-lg transition-all duration-200 cursor-pointer"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                </button>
            </div>
        );
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white">
            <div className={clsx("transition-shadow duration-300", scrolled && "shadow-[0_2px_12px_rgba(0,0,0,0.08)]")}>
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <Image src={Logo} alt="JobSpring Logo" width={200} height={200} priority />
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="group relative px-4 py-1.5 text-md text-gray-700 rounded-xl transition-all duration-200 hover:text-black"
                            >
                                {link.label}
                                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-0.5 w-0 rounded-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-300 group-hover:w-3/4" />
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-3 shrink-0">
                        <DesktopAuth />
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

                <div className={clsx(
                    "md:hidden absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-50 overflow-hidden transition-all duration-300 ease-in-out",
                    mobileOpen ? "max-h-[420px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
                )}>
                    <nav className="flex flex-col gap-1 px-5 pb-6 pt-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="px-4 py-3 text-md text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="border-t border-gray-100 mt-4 pt-4">
                            <MobileAuth />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}