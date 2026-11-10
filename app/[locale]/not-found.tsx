"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import { reportError } from "@/src/lib/reportError";

export default function NotFound() {
    useEffect(() => {
        reportError(new Error("Page not found (404)"), { source: "not-found" });
    }, []);

    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl shadow-gray-200/60">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
                    <SearchX className="h-8 w-8 text-[#696CFF]" strokeWidth={1.75} />
                </div>
                <p className="text-sm font-medium text-[#696CFF]">404</p>
                <h1 className="mt-1 text-xl font-semibold text-gray-900">Page not found</h1>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-[#696CFF] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                    <Home className="h-4 w-4" />
                    Go home
                </Link>
            </div>
        </main>
    );
}