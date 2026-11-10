"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, Copy, Home, RotateCcw } from "lucide-react";
import { reportError } from "@/src/lib/reportError";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        reportError(error, { source: "react-error-boundary" });
    }, [error]);

    const copyId = async () => {
        if (!error.digest) return;
        try {
            await navigator.clipboard.writeText(error.digest);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard blocked, ignore */
        }
    };

    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xl shadow-gray-200/60">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                    <AlertTriangle className="h-8 w-8 text-red-500" strokeWidth={1.75} />
                </div>

                <h1 className="text-xl font-semibold text-gray-900">
                    Something went wrong
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    We hit an unexpected problem loading this page. The issue has been
                    reported automatically. Please try again, or go back to the home page.
                </p>

                {process.env.NODE_ENV === "development" && error.message && (
                    <pre className="mt-5 max-h-32 overflow-auto rounded-lg bg-gray-50 p-3 text-left text-xs text-red-600">
                        {error.message}
                    </pre>
                )}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#696CFF] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Try again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <Home className="h-4 w-4" />
                        Go home
                    </Link>
                </div>

                {error.digest && (
                    <button
                        type="button"
                        onClick={copyId}
                        className="mt-6 inline-flex cursor-pointer items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-600"
                        aria-label="Copy error ID"
                    >
                        Error ID: {error.digest}
                        {copied ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                            <Copy className="h-3.5 w-3.5" />
                        )}
                    </button>
                )}
            </div>
        </main>
    );
}