
import Link from "next/link";
import { FiSearch, FiMapPin, FiZap } from "react-icons/fi";

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

                </div>

            </section>

        </div>
    );
}