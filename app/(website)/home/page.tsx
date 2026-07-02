"use client";

import React from "react";
import Link from "next/link";
import {
    FiSearch,
    FiMapPin,
    FiArrowRight,
    FiZap
} from "react-icons/fi";

export default function HomePage() {

    return (
        <div className="bg-white min-h-screen text-slate-800 font-sans">
            <section className="relative w-full max-w-7xl mx-auto py-10 px-4 md:py-24 overflow-hidden">
                <div className="absolute top-10 left-10 w-80 h-80 bg-[#07c4ec]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#71dd37]/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/60 mb-6 text-xs font-semibold text-slate-600 shadow-sm animate-pulse">
                        <FiZap className="text-[#07c4ec]" />
                        <span>Discover the next level of career platforms</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
                        Find Your <span className="g-text">Dream Job Faster</span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-500 max-w-2xl mb-10 leading-relaxed font-medium">
                        JobSpring bridges the gap between top professionals and forward-thinking companies. Discover verified listings, smart recommendations, and an easier application workflow.
                    </p>

                    {/* <form
                        onSubmit={handleSearchSubmit}
                        className="w-full bg-white p-3 rounded-2xl border border-slate-200 shadow-xl shadow-slate-100/50 flex flex-col md:flex-row gap-3 max-w-3xl mb-8"
                    >
                        <div className="flex-1 flex items-center px-3 gap-3 border-b md:border-b-0 md:border-r border-slate-100 py-2">
                            <FiSearch className="text-slate-400 w-5 h-5 shrink-0" />
                            <input
                                type="text"
                                placeholder="Job title, skills, or company name..."
                                value={searchTitle}
                                onChange={(e) => setSearchTitle(e.target.value)}
                                className="w-full focus:outline-none text-sm text-slate-700 placeholder-slate-400 font-medium"
                            />
                        </div>
                        <div className="flex-1 flex items-center px-3 gap-3 py-2">
                            <FiMapPin className="text-slate-400 w-5 h-5 shrink-0" />
                            <input
                                type="text"
                                placeholder="Location or 'Remote'..."
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                                className="w-full focus:outline-none text-sm text-slate-700 placeholder-slate-400 font-medium"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-3.5 btn-gradient font-bold text-sm text-white shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                            <FiSearch /> Find Jobs
                        </button>
                    </form>

                    <div className="flex items-center gap-4 mb-16">
                        <Link
                            href="/jobs"
                            className="px-6 py-3 bg-slate-950 text-white rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition-colors flex items-center gap-1"
                        >
                            Browse Jobs <FiArrowRight />
                        </Link>
                        <Link
                            href="/register"
                            className="px-6 py-3 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
                        >
                            Post a Job
                        </Link>
                    </div> */}
                </div>
            </section>

        </div>
    );
}