// "use client";

// import { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname, useRouter } from "next/navigation";
// import { authClient } from "@/src/lib/auth-client";
// import Logo from "@/public/logo/logo.png";
// import {
//     LogIn,
//     UserPlus,
//     Menu,
//     X,
//     UserRound,
//     LogOut,
//     ChevronDown,
// } from "lucide-react";
// import AppButtonIcon from "../common/AppButtonIcon";
// import LanguageSwitcher from "../common/LanguageSwitcher";

// const navLinks = [
//     { label: "Home", href: "/home" },
//     { label: "Find Jobs", href: "/find-jobs" },
// ];

// export default function Header() {
//     const router = useRouter();
//     const pathname = usePathname();
//     const [mobileOpen, setMobileOpen] = useState(false);
//     const [profileOpen, setProfileOpen] = useState(false);
//     const profileRef = useRef<HTMLDivElement>(null);

//     const { data: session, isPending } = authClient.useSession();
//     const user = session?.user;

//     useEffect(() => {
//         function handleClickOutside(event: MouseEvent) {
//             if (
//                 profileRef.current &&
//                 !profileRef.current.contains(event.target as Node)
//             ) {
//                 setProfileOpen(false);
//             }
//         }
//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     const handleLogout = async () => {
//         setProfileOpen(false);
//         await authClient.signOut();
//         router.push("/sign-in");
//     };

//     return (
//         <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
//             <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-18">
//                 <Link href="/" className="flex items-center gap-2 shrink-0">
//                     <Image
//                         src={Logo}
//                         alt="JobSpring Logo"
//                         width={200}
//                         height={60}
//                         priority
//                     />
//                 </Link>

//                 <nav className="hidden md:flex items-center gap-1">
//                     {navLinks.map((link) => {
//                         const isActive = pathname === link.href;
//                         return (
//                             <Link
//                                 key={link.href}
//                                 href={link.href}
//                                 className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive
//                                     ? "text-[#07c4ec] bg-cyan-50/70 font-semibold"
//                                     : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
//                                     }`}
//                             >
//                                 {link.label}
//                             </Link>
//                         );
//                     })}
//                 </nav>

//                 <div className="hidden md:flex items-center gap-3">
//                     {/* <LanguageSwitcher /> */}

//                     {isPending ? (
//                         <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-xl" />
//                     ) : user ? (
//                         <div className="relative" ref={profileRef}>
//                             <button
//                                 type="button"
//                                 onClick={() => setProfileOpen((prev) => !prev)}
//                                 className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer"
//                             >
//                                 {user.image ? (
//                                     <Image
//                                         src={user.image}
//                                         alt={user.name || "User"}
//                                         width={42}
//                                         height={42}
//                                         className="w-13 h-13 rounded-full object-cover"
//                                     />
//                                 ) : (
//                                     <div className="w-12 h-12 rounded-full border-2 border-[#07c4ec]/80 flex items-center justify-center">
//                                         <UserRound className="w-8 h-8 text-[#07c4ec]" />
//                                     </div>
//                                 )}
//                                 <span className="text-sm font-semibold text-gray-800 max-w-[120px] truncate">
//                                     {user.name || "My Account"}
//                                 </span>
//                                 <ChevronDown
//                                     className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""
//                                         }`}
//                                 />
//                             </button>

//                             {profileOpen && (
//                                 <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-lg py-2 z-50">
//                                     <div className="px-4 py-2 border-b border-gray-100">
//                                         <p className="text-sm font-bold text-gray-800 truncate">
//                                             {user.name}
//                                         </p>
//                                         <p className="text-xs text-gray-500 truncate">
//                                             {user.email}
//                                         </p>
//                                     </div>
//                                     <Link
//                                         href="/profile"
//                                         onClick={() => setProfileOpen(false)}
//                                         className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                                     >
//                                         <UserRound className="w-4 h-4" />
//                                         My Profile
//                                     </Link>
//                                     <button
//                                         type="button"
//                                         onClick={handleLogout}
//                                         className="w-full flex items-center cursor-pointer gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                                     >
//                                         <LogOut className="w-4 h-4" />
//                                         Logout
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     ) : (
//                         <div className="flex items-center gap-2">
//                             <AppButtonIcon onClick={() => router.push("/sign-up")} bgColor="#ffff" textColor="#07c4ec" text="Sign Up" icon={<UserPlus className="w-5 h-5" />} />
//                             <AppButtonIcon onClick={() => router.push("/sign-in")} text="Sign In" icon={<LogIn className="w-5 h-5" />} />
//                         </div>
//                     )}
//                 </div>

//                 <div className="md:hidden flex items-center gap-2">
//                     <LanguageSwitcher />
//                     <button
//                         type="button"
//                         onClick={() => setMobileOpen((prev) => !prev)}
//                         className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
//                         aria-label="Toggle navigation menu"
//                     >
//                         {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//                     </button>
//                 </div>
//             </div>

//             {mobileOpen && (
//                 <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
//                     <nav className="flex flex-col gap-1">
//                         {navLinks.map((link) => (
//                             <Link
//                                 key={link.href}
//                                 href={link.href}
//                                 onClick={() => setMobileOpen(false)}
//                                 className={`px-4 py-2.5 rounded-xl text-sm font-medium ${pathname === link.href
//                                     ? "text-[#07c4ec] bg-cyan-50/70 font-semibold"
//                                     : "text-gray-700 hover:bg-gray-50"
//                                     }`}
//                             >
//                                 {link.label}
//                             </Link>
//                         ))}
//                     </nav>

//                     <div className="pt-3">
//                         {user ? (
//                             <div className="space-y-2">
//                                 <div className="px-3 py-2 bg-gray-50 rounded-xl">
//                                     <p className="text-sm font-bold text-gray-800">{user.name}</p>
//                                     <p className="text-xs text-gray-500">{user.email}</p>
//                                 </div>
//                                 <Link
//                                     href="/profile"
//                                     onClick={() => setMobileOpen(false)}
//                                     className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl"
//                                 >
//                                     <UserRound className="w-4 h-4" />
//                                     My Profile
//                                 </Link>
//                                 <button
//                                     type="button"
//                                     onClick={handleLogout}
//                                     className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl"
//                                 >
//                                     <LogOut className="w-4 h-4" />
//                                     Logout
//                                 </button>
//                             </div>
//                         ) : (
//                             <div className="flex flex-col gap-2">
//                                 <Link
//                                     href="/sign-in"
//                                     onClick={() => setMobileOpen(false)}
//                                     className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#07c4ec]/40 text-[#07c4ec] rounded-xl text-sm font-semibold"
//                                 >
//                                     <LogIn className="w-4 h-4" />
//                                     <span>Sign In</span>
//                                 </Link>
//                                 <Link
//                                     href="/sign-up"
//                                     onClick={() => setMobileOpen(false)}
//                                     className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#07c4ec] text-white rounded-xl text-sm font-semibold shadow-sm"
//                                 >
//                                     <UserPlus className="w-4 h-4" />
//                                     <span>Sign Up</span>
//                                 </Link>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </header>
//     );
// }



"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import Logo from "@/public/logo/logo.png";
import {
    LogIn,
    UserPlus,
    Menu,
    X,
    UserRound,
    LogOut,
    ChevronDown,
} from "lucide-react";
import AppButtonIcon from "../common/AppButtonIcon";
import LanguageSwitcher from "../common/LanguageSwitcher";
import useUser from "@/src/features/users/useUser";

const navLinks = [
    { label: "Home", href: "/home" },
    { label: "Find Jobs", href: "/find-jobs" },
];

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const { isPending } = authClient.useSession();
    const { user } = useUser(); // useUser() already syncs Redux from the session internally

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setProfileOpen(false);
        await authClient.signOut();
        router.push("/sign-in");
    };

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-18">
                <Link href="/" className="flex items-center gap-2 shrink-0">
                    <Image
                        src={Logo}
                        alt="JobSpring Logo"
                        width={200}
                        height={60}
                        priority
                    />
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${isActive
                                    ? "text-[#07c4ec] bg-cyan-50/70 font-semibold"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="hidden md:flex items-center gap-3">
                    {isPending ? (
                        <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-xl" />
                    ) : user ? (
                        <div className="relative" ref={profileRef}>
                            <button
                                type="button"
                                onClick={() => setProfileOpen((prev) => !prev)}
                                className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer"
                            >
                                {user.image ? (
                                    <Image
                                        key={user.image}
                                        src={user.image}
                                        alt={user.name || "User"}
                                        width={42}
                                        height={42}
                                        className="w-13 h-13 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full border-2 border-[#07c4ec]/80 flex items-center justify-center">
                                        <UserRound className="w-8 h-8 text-[#07c4ec]" />
                                    </div>
                                )}
                                <span className="text-sm font-semibold text-gray-800 max-w-[120px] truncate">
                                    {user.name || "My Account"}
                                </span>
                                <ChevronDown
                                    className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {profileOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-lg py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-sm font-bold text-gray-800 truncate">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                    <Link
                                        href="/profile"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <UserRound className="w-4 h-4" />
                                        My Profile
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="w-full flex items-center cursor-pointer gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <AppButtonIcon onClick={() => router.push("/sign-up")} bgColor="#ffff" textColor="#07c4ec" text="Sign Up" icon={<UserPlus className="w-5 h-5" />} />
                            <AppButtonIcon onClick={() => router.push("/sign-in")} text="Sign In" icon={<LogIn className="w-5 h-5" />} />
                        </div>
                    )}
                </div>

                <div className="md:hidden flex items-center gap-2">
                    <LanguageSwitcher />
                    <button
                        type="button"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
                    <nav className="flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`px-4 py-2.5 rounded-xl text-sm font-medium ${pathname === link.href
                                    ? "text-[#07c4ec] bg-cyan-50/70 font-semibold"
                                    : "text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="pt-3">
                        {user ? (
                            <div className="space-y-2">
                                <div className="px-3 py-2 bg-gray-50 rounded-xl">
                                    <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <Link
                                    href="/profile"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl"
                                >
                                    <UserRound className="w-4 h-4" />
                                    My Profile
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Link
                                    href="/sign-in"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#07c4ec]/40 text-[#07c4ec] rounded-xl text-sm font-semibold"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span>Sign In</span>
                                </Link>
                                <Link
                                    href="/sign-up"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#07c4ec] text-white rounded-xl text-sm font-semibold shadow-sm"
                                >
                                    <UserPlus className="w-4 h-4" />
                                    <span>Sign Up</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}