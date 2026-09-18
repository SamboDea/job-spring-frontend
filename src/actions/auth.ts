"use server";

import { auth } from "@/src/lib/auth";
import { pool } from "@/src/lib/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth";
import { Candidate, createCandidate, getCandidateByUserId } from "@/src/features/candidate/personal-information/action";

export type AuthState = { error: string | null };

const BASE_URL = process.env.BETTER_AUTH_URL!;

export async function signUpAction(
    prevState: AuthState,
    formData: FormData
): Promise<AuthState> {
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)
        ?.trim()
        .toLowerCase();
    const password = formData.get("password") as string;
    const role = (formData.get("role") as string) ?? "candidate";

    const allowedRoles = ["candidate", "company"] as const;
    type AllowedRole = typeof allowedRoles[number];

    if (!name || !email || !password) {
        return { error: "All fields are required." };
    }

    if (!allowedRoles.includes(role as AllowedRole)) {
        return { error: "Please select a valid account type." };
    }

    try {
        const result = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
                callbackURL: "/sign-in"
            },
            headers: await headers(),
        });

        if (result?.user?.id) {
            await pool.query(
                `UPDATE "user" SET role = $1 WHERE id = $2`,
                [role, result.user.id]
            );

            if (role === "candidate") {
                try {
                    const existing = await getCandidateByUserId(result.user.id);
                    if (!existing) {
                        await createCandidate({}, result.user.id);
                    }
                } catch (err) {
                    console.error("Failed to create candidate record:", err);
                }
            }
        }
    } catch (error) {
        console.error("Better Auth signup error:", error);

        if (error instanceof APIError) {
            if (error.status === 429) {
                return {
                    error:
                        "Too many attempts. Please wait a moment and try again.",
                };
            }

            return {
                error:
                    error.message ||
                    "Registration failed. Please try again.",
            };
        }

        return { error: "Registration failed. Please try again." };
    }

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
    let userId: string | undefined;

    if (setCookie) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        setCookie.split(/,(?=\s*\w+=)/).forEach((c) => {
            const [pair] = c.split(";");
            const [key, value] = pair.split("=");
            if (key && value) cookieStore.set(key.trim(), value.trim());
        });
    }

    const signInData = await res.json().catch(() => null);
    userId = signInData?.user?.id;

    if (userId) {
        let existingCandidate: Candidate | null;
        try {
            existingCandidate = await getCandidateByUserId(userId);
        } catch (err) {
            console.error("Failed to check candidate:", err);
            return { error: "Something went wrong. Please try again." };
        }

        if (!existingCandidate) {
            redirect("/onboarding");
        }
    }

    redirect("/profile");
}

export async function signOutAction() {
    const { auth } = await import("@/src/lib/auth");
    await auth.api.signOut({ headers: await headers() });
    redirect("/sign-in");
}