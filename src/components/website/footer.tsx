"use client";

import Link from "next/link";
import { FaLinkedinIn, FaXTwitter, FaFacebookF, FaInstagram } from "react-icons/fa6";
import Logo from "@/public/logo/logo.png";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-100 py-10 w-full text-slate-500">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12">
                <div className="flex flex-col">
                    <Image src={Logo} alt="Logo" width={220} height={220} />
                    <p className="text-sm leading-relaxed text-slate-500 mt-4 max-w-xs font-medium">
                        Connecting tech talent with verified industry opportunities. Find your dream codebase or scale your engineering teams seamlessly.
                    </p>
                    <div className="flex gap-3 mt-6">
                        <a
                            href="#"
                            className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:text-white flex items-center justify-center transition-all hover:bg-gradient-to-r hover:from-[#07c4ec] hover:to-[#71dd37] hover:border-transparent hover:scale-105 hover:shadow-lg hover:shadow-[#07c4ec1c]"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedinIn className="w-4 h-4" />
                        </a>
                        <a
                            href="#"
                            className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:text-white flex items-center justify-center transition-all hover:bg-gradient-to-r hover:from-[#07c4ec] hover:to-[#71dd37] hover:border-transparent hover:scale-105 hover:shadow-lg hover:shadow-[#07c4ec1c]"
                            aria-label="Twitter / X"
                        >
                            <FaXTwitter className="w-4 h-4" />
                        </a>
                        <a
                            href="#"
                            className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:text-white flex items-center justify-center transition-all hover:bg-gradient-to-r hover:from-[#07c4ec] hover:to-[#71dd37] hover:border-transparent hover:scale-105 hover:shadow-lg hover:shadow-[#07c4ec1c]"
                            aria-label="Facebook"
                        >
                            <FaFacebookF className="w-3.5 h-3.5" />
                        </a>
                        <a
                            href="#"
                            className="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:text-white flex items-center justify-center transition-all hover:bg-gradient-to-r hover:from-[#07c4ec] hover:to-[#71dd37] hover:border-transparent hover:scale-105 hover:shadow-lg hover:shadow-[#07c4ec1c]"
                            aria-label="Instagram"
                        >
                            <FaInstagram className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-3 font-medium">
                    <h4 className="font-extrabold text-slate-900 text-xs tracking-wider uppercase mb-1">
                        For Job Seekers
                    </h4>
                    <Link href="/jobs" className="text-md text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-200">
                        Browse Jobs
                    </Link>
                    <Link href="/jobs" className="text-md text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-200">
                        Companies
                    </Link>
                    <Link href="/jobs" className="text-md text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-200">
                        Salaries
                    </Link>
                    <Link href="/jobs" className="text-md text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-200">
                        Career Advice
                    </Link>
                </div>

                {/* Column 3 */}
                <div className="flex flex-col gap-3 font-medium">
                    <h4 className="font-extrabold text-slate-900 text-xs tracking-wider uppercase mb-1">
                        For Employers
                    </h4>
                    <Link href="/register?role=employer" className="text-md text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-200">
                        Post a Job
                    </Link>
                    <Link href="/register" className="text-md text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-200">
                        Search Resumes
                    </Link>
                    <Link href="/register" className="text-md text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-200">
                        Pricing Options
                    </Link>
                    <Link href="/register" className="text-md text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-200">
                        Recruiter Tools
                    </Link>
                </div>

                {/* Column 4 */}
                <div className="flex flex-col gap-3 font-medium">
                    <h4 className="font-extrabold text-slate-900 text-xs tracking-wider uppercase mb-1">
                        Company
                    </h4>
                    <Link href="/about" className="text-md text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-200">
                        About Us
                    </Link>
                    <Link href="/about" className="text-md text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-200">
                        Blog Posts
                    </Link>
                    <Link href="/about" className="text-md text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-200">
                        Press Kit
                    </Link>
                    <Link href="/about" className="text-md text-slate-500 hover:text-slate-900 hover:translate-x-1 transition-all duration-200">
                        Contact Support
                    </Link>
                </div>
            </div>

            {/* Bottom copyright details */}
            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-semibold">
                <p>© 2026 JobSpring. All rights reserved.</p>
                <p>Made with ❤️ for developers everywhere</p>
            </div>
        </footer>
    );
}