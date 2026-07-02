// app/actions/auth.ts
"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type AuthState = { error: string | null };

const BASE_URL = process.env.BETTER_AUTH_URL!;

export async function signUpAction(
    prevState: AuthState,
    formData: FormData
): Promise<AuthState> {
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        return { error: "All fields are required." };
    }
    if (password.length < 8) {
        return { error: "Password must be at least 8 characters." };
    }

    const incomingHeaders = await headers();
    const res = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            cookie: incomingHeaders.get("cookie") ?? "",
            "x-forwarded-for": incomingHeaders.get("x-forwarded-for") ?? "",
            origin: BASE_URL, // ← fixes "Missing or null Origin"
        },
        body: JSON.stringify({ name, email, password }),
    });

    if (res.status === 429) {
        return { error: "Too many attempts. Please wait a moment and try again." };
    }
    if (!res.ok) {
        const data = await res.json().catch(() => null);
        return { error: data?.message ?? "Registration failed. Please try again." };
    }

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        setCookie.split(/,(?=\s*\w+=)/).forEach((c) => {
            const [pair] = c.split(";");
            const [key, value] = pair.split("=");
            if (key && value) cookieStore.set(key.trim(), value.trim());
        });
    }

    redirect("/login");
}

export async function signInAction(
    prevState: AuthState,
    formData: FormData
): Promise<AuthState> {
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required." };
    }

    const incomingHeaders = await headers();
    const res = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            cookie: incomingHeaders.get("cookie") ?? "",
            "x-forwarded-for": incomingHeaders.get("x-forwarded-for") ?? "",
            origin: BASE_URL,
        },
        body: JSON.stringify({ email, password }),
    });

    if (res.status === 429) {
        return { error: "Too many attempts. Please wait a moment and try again." };
    }
    if (!res.ok) {
        return { error: "Invalid email or password." };
    }

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        setCookie.split(/,(?=\s*\w+=)/).forEach((c) => {
            const [pair] = c.split(";");
            const [key, value] = pair.split("=");
            if (key && value) cookieStore.set(key.trim(), value.trim());
        });
    }

    redirect("/home");
}

export async function signOutAction() {
    const { auth } = await import("@/src/lib/auth");
    await auth.api.signOut({ headers: await headers() });
    redirect("/home");
}