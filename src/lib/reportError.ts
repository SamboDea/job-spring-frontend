type Extra = { source?: string };

export function reportError(error: unknown, extra: Extra = {}) {
    const err = error instanceof Error ? error : new Error(String(error));

    fetch("/api/report-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
            message: err.message,
            stack: err.stack,
            source: extra.source ?? "client",
            url: typeof window !== "undefined" ? window.location.href : "",
        }),
    }).catch(() => { });
}