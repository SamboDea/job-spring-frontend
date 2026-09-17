"use server";

import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

const SPRING_API_URL = process.env.SPRING_API_URL!;

export type JobPostPayload = {
    jobCode: string;
    title: string;
    description: string;
    responsibilities: string;
    requirements: string;
    benefits: string;
    location: string;
    employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
    workMode: "ONSITE" | "REMOTE" | "HYBRID";
    minimumSalary: number;
    maximumSalary: number;
    currency: "USD" | "KHR";
    numberOfPositions: number;
    jobPostStatus: "DRAFT" | "PUBLISHED" | "CLOSED";
    applicationDeadline: string;
};

export type JobPostState = {
    success: boolean;
    error: string | null;
    data?: unknown;
};

async function getAuthenticatedUserId(): Promise<string | null> {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user?.id ?? null;
}

export async function getNextJobCode(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `JOB-${year}-`;
    const codeRegex = new RegExp(`^JOB-${year}-(\\d+)$`);

    const userId = await getAuthenticatedUserId();

    if (userId) {
        try {
            const res = await fetch(`${SPRING_API_URL}/api/job-posts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": userId,
                },
                cache: "no-store",
            });

            if (res.ok) {
                const body = await res.json();

                const posts: unknown[] = Array.isArray(body)
                    ? body
                    : Array.isArray(body?.content)
                        ? body.content
                        : [];

                let maxSeq = 0;
                for (const post of posts) {
                    const code = (post as { jobCode?: string })?.jobCode ?? "";
                    const match = code.match(codeRegex);
                    if (match) {
                        const seq = parseInt(match[1], 10);
                        if (seq > maxSeq) maxSeq = seq;
                    }
                }

                const nextSeq = String(maxSeq + 1).padStart(4, "0");
                return `${prefix}${nextSeq}`;
            }
        } catch (err) {
            console.warn("getNextJobCode: could not reach Spring API, using fallback", err);
        }
    }

    return `${prefix}0001`;
}

async function extractErrorMessage(res: Response): Promise<string> {
    let message = `API error: ${res.status} ${res.statusText}`;
    try {
        const errBody = await res.json();
        console.error("Spring API error response:", errBody);
        if (typeof errBody === "string") return errBody;
        if (errBody?.message) return errBody.message;
        if (errBody?.error && typeof errBody.error === "string") return errBody.error;
        if (Array.isArray(errBody?.errors)) {
            return errBody.errors
                .map((e: any) => e?.defaultMessage || e?.message || JSON.stringify(e))
                .join(", ");
        }
        if (typeof errBody === "object") {
            return JSON.stringify(errBody);
        }
    } catch {
        /* ignore */
    }
    return message;
}

export async function createJobPostAction(payload: JobPostPayload): Promise<JobPostState> {
    const userId = await getAuthenticatedUserId();

    if (!userId) {
        return { success: false, error: "Unauthorized. Please sign in first." };
    }

    try {
        const res = await fetch(`${SPRING_API_URL}/api/job-posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-User-Id": userId,
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const message = await extractErrorMessage(res);
            return { success: false, error: message };
        }

        const data = await res.json();
        return { success: true, error: null, data };
    } catch (err) {
        console.error("createJobPostAction error:", err);
        return { success: false, error: "Failed to connect to the job service. Please try again." };
    }
}

export type JobPost = JobPostPayload & {
    id: string;
    createdAt?: string;
    updatedAt?: string;
};

export async function fetchJobPostsAction(): Promise<{ success: boolean; error: string | null; data: JobPost[] }> {
    const userId = await getAuthenticatedUserId();
    if (!userId) return { success: false, error: "Unauthorized.", data: [] };

    try {
        const res = await fetch(`${SPRING_API_URL}/api/job-posts`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "X-User-Id": userId },
            cache: "no-store",
        });

        if (!res.ok) return { success: false, error: `API error: ${res.status}`, data: [] };

        const body = await res.json();
        const posts: JobPost[] = Array.isArray(body)
            ? body
            : Array.isArray(body?.content)
                ? body.content
                : [];

        return { success: true, error: null, data: posts };
    } catch (err) {
        console.error("fetchJobPostsAction error:", err);
        return { success: false, error: "Failed to fetch job posts.", data: [] };
    }
}

// ─── Fetch single job post by ID ──────────────────────────────────────────────

export async function getJobPostByIdAction(id: string): Promise<{ success: boolean; error: string | null; data?: JobPost }> {
    const userId = await getAuthenticatedUserId();
    if (!userId) return { success: false, error: "Unauthorized." };

    try {
        const res = await fetch(`${SPRING_API_URL}/api/job-posts/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "X-User-Id": userId },
            cache: "no-store",
        });

        if (!res.ok) {
            let message = `API error: ${res.status} ${res.statusText}`;
            try {
                const errBody = await res.json();
                if (errBody?.message) message = errBody.message;
            } catch { /* ignore */ }
            return { success: false, error: message };
        }

        const data: JobPost = await res.json();
        return { success: true, error: null, data };
    } catch (err) {
        console.error("getJobPostByIdAction error:", err);
        return { success: false, error: "Failed to fetch job post details." };
    }
}

// ─── Update job post ──────────────────────────────────────────────────────────

export async function updateJobPostAction(id: string, payload: Partial<JobPostPayload>): Promise<JobPostState> {
    const userId = await getAuthenticatedUserId();
    if (!userId) return { success: false, error: "Unauthorized." };

    try {
        const res = await fetch(`${SPRING_API_URL}/api/job-posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "X-User-Id": userId },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const message = await extractErrorMessage(res);
            return { success: false, error: message };
        }

        const data = await res.json();
        return { success: true, error: null, data };
    } catch (err) {
        console.error("updateJobPostAction error:", err);
        return { success: false, error: "Failed to update job post." };
    }
}

// ─── Delete job post ──────────────────────────────────────────────────────────

export async function deleteJobPostAction(id: string): Promise<JobPostState> {
    const userId = await getAuthenticatedUserId();
    if (!userId) return { success: false, error: "Unauthorized." };

    try {
        const res = await fetch(`${SPRING_API_URL}/api/job-posts/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "X-User-Id": userId },
        });

        if (!res.ok) {
            const message = await extractErrorMessage(res);
            return { success: false, error: message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("deleteJobPostAction error:", err);
        return { success: false, error: "Failed to delete job post." };
    }
}

// ─── Fetch public job posts (no auth required, for website) ──────────────────

export async function fetchPublicJobPostsAction(): Promise<{ success: boolean; error: string | null; data: JobPost[] }> {
    try {
        // Try a /public endpoint first; fall back to the main endpoint without X-User-Id
        const res = await fetch(`${SPRING_API_URL}/api/job-posts`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
        });

        if (!res.ok) return { success: false, error: `API error: ${res.status}`, data: [] };

        const body = await res.json();
        const posts: JobPost[] = Array.isArray(body)
            ? body
            : Array.isArray(body?.content)
                ? body.content
                : [];

        return { success: true, error: null, data: posts };
    } catch (err) {
        console.error("fetchPublicJobPostsAction error:", err);
        return { success: false, error: "Failed to fetch job posts.", data: [] };
    }
}
