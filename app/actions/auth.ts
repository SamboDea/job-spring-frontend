// app/actions/auth.ts
"use server";

import { auth } from "@/src/lib/auth";
import { pool } from "@/src/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth";

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

    // Check if the user already exists in the database
    try {
        const { rows } = await pool.query('SELECT id FROM "user" WHERE email = $1 LIMIT 1', [email]);
        if (rows.length > 0) {
            return { error: "This email is already registered. Please sign in instead." };
        }
    } catch (dbErr) {
        console.error("Database lookup error during registration:", dbErr);
        return { error: "An unexpected error occurred. Please try again." };
    }

    try {
        await auth.api.signUpEmail({
            body: { name, email, password },
            headers: await headers(),
        });
    } catch (err) {
        if (err instanceof APIError) {
            if (err.status === 429) {
                return { error: "Too many attempts. Please wait a moment and try again." };
            }
            return { error: err.message ?? "Registration failed. Please try again." };
        }
        console.error("Unexpected sign-up error:", err);
        return { error: "Registration failed. Please try again." };
    }

    // OTP is already sent by the emailOTP plugin (sendVerificationOnSignUp: true)
    redirect(`/verify-email?email=${encodeURIComponent(email)}`);
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

    redirect("/dashboard");
}

export async function signOutAction() {
    const { auth } = await import("@/src/lib/auth");
    await auth.api.signOut({ headers: await headers() });
    redirect("/login");
}