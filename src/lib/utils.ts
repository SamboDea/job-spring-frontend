import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from 'dompurify';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function htmlToStructuredText(html: string): string {
    const clean = DOMPurify.sanitize(html);
    const container = document.createElement('div');
    container.innerHTML = clean;
    const lines: string[] = [];

    container.querySelectorAll('p, li').forEach((el) => {
        if (el.tagName === 'P' && el.closest('li')) return;

        const text = el.textContent?.trim();
        if (!text) return;

        if (el.tagName === 'LI') {
            lines.push(`• ${text}`);
        } else {
            lines.push(text);
        }
    });

    return lines.join('\n');
}

export function encodeUserId(id: string): string {
    if (!id) return "";
    try {
        if (typeof window !== "undefined") {
            return btoa(unescape(encodeURIComponent(id)))
                .replace(/\+/g, "-")
                .replace(/\//g, "_")
                .replace(/=+$/, "");
        }
        return Buffer.from(id, "utf-8").toString("base64url");
    } catch {
        return id;
    }
}

export function decodeUserId(encoded: string): string {
    if (!encoded) return "";
    try {
        if (typeof window !== "undefined") {
            let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
            while (base64.length % 4) {
                base64 += "=";
            }
            return decodeURIComponent(escape(atob(base64)));
        }
        return Buffer.from(encoded, "base64url").toString("utf-8");
    } catch {
        return encoded;
    }
}

export const formatDate = (date?: string) => {
    if (!date) return "";
    const [year, day, month] = date.slice(0, 10).split("-");
    return `${day}/${month}/${year}`;
};

export function formatMonthYear(value?: string | null): string | undefined {
    if (!value) return undefined;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function buildFileName(fullName: string): string {
    const safe = fullName.trim().replace(/[^\w\-]+/g, "_") || "My";
    return `${safe}_CV.pdf`;
}

export function toLines(value?: string | string[] | null): string[] | undefined {
    if (!value) return undefined;

    const raw = Array.isArray(value) ? value : value.split(/\r?\n/);

    const lines = raw
        .map((line) => line.replace(/^\s*[-•*●▪]+\s*/, "").trim()) // strip leading bullet characters
        .filter(Boolean);

    return lines.length > 0 ? lines : undefined;
}

export async function imageToDataUrl(url?: string | null): Promise<string | undefined> {
    if (!url) return undefined;
    if (url.startsWith("data:")) return url; // already base64, nothing to fetch

    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return undefined;
        const blob = await res.blob();
        return await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch {
        return undefined;
    }
}