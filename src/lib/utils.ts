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
