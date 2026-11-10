"use client";

import { useEffect } from "react";
import { reportError } from "@/src/lib/reportError";

export default function ErrorReporter() {
    useEffect(() => {
        const onError = (e: ErrorEvent) =>
            reportError(e.error ?? e.message, { source: "window.onerror" });
        const onRejection = (e: PromiseRejectionEvent) =>
            reportError(e.reason, { source: "unhandledrejection" });

        window.addEventListener("error", onError);
        window.addEventListener("unhandledrejection", onRejection);
        return () => {
            window.removeEventListener("error", onError);
            window.removeEventListener("unhandledrejection", onRejection);
        };
    }, []);

    return null;
}