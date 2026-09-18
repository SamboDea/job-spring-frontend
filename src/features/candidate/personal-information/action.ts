"use server";

export interface CandidatePayload {
    gender?: string | null;
    contactNumber?: string | null;
    dateOfBirth?: string | null;
    country?: string | null;
    city?: string | null;
    jobTitle?: string | null;
    jobLevelId?: number | null;
    industry?: string | null;
    githubUsername?: string | null;
    linkedinUsername?: string | null;
    portfolio?: string | null;
    description?: string | null;
    address?: string | null;
}

export interface Candidate extends CandidatePayload {
    candidateId: number;
    userId: string;
    jobLevelName: string | null;
    isDeleted: boolean;
    createdAt: string;
}

export async function getCandidateById(id: string): Promise<Candidate | null> {
    const response = await fetch(`${process.env.SPRING_API_URL}/api/v1/candidates/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (response.status === 404) return null;

    if (!response.ok) {
        const errorBody = await response.text().catch(() => null);
        throw new Error(`Failed to fetch candidate: ${response.status} ${errorBody ?? response.statusText}`);
    }

    return response.json();
}

export async function getCandidateByUserId(userId: string): Promise<Candidate | null> {
    const response = await fetch(`${process.env.SPRING_API_URL}/api/v1/candidates/user/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (response.status === 404) return null;

    if (!response.ok) {
        const errorBody = await response.text().catch(() => null);
        throw new Error(`Failed to fetch candidate: ${response.status} ${errorBody ?? response.statusText}`);
    }

    return response.json();
}

export async function createCandidate(payload: CandidatePayload, userId: string): Promise<Candidate> {
    const response = await fetch(`${process.env.SPRING_API_URL}/api/v1/candidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, userId }),
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => null);
        throw new Error(`Failed to create candidate: ${response.status} ${errorBody ?? response.statusText}`);
    }

    return response.json();
}

export async function updateCandidate(id: string, payload: CandidatePayload): Promise<Candidate> {
    const response = await fetch(`${process.env.SPRING_API_URL}/api/v1/candidates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => null);
        throw new Error(`Failed to update candidate: ${response.status} ${errorBody ?? response.statusText}`);
    }

    return response.json();
}