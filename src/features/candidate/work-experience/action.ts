"use server";

export interface WorkExperiencePayload {
    candidateId: number;
    jobTitle: string;
    jobLevelId: number | null;
    companyName: string;
    typeOfExperienceId: number | null;
    city: string | null;
    country: string | null;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    jobResponsibility: string | null;
    createdBy: string;
}

export interface WorkExperience extends WorkExperiencePayload {
    workExperienceId: number;
    createdAt: string;
}

export async function createMultipleWorkExperiences(
    experiences: WorkExperiencePayload[]
): Promise<WorkExperience[]> {
    const response = await fetch(`${process.env.SPRING_API_URL}/api/v1/work-experiences/multiple`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(experiences),
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => null);
        throw new Error(`Failed to create work experiences: ${response.status} ${errorBody ?? response.statusText}`);
    }

    return response.json();
}

export async function getWorkExperiencesByCandidateId(
    candidateId: number
): Promise<WorkExperience[]> {
    const response = await fetch(
        `${process.env.SPRING_API_URL}/api/v1/work-experiences/candidate/${candidateId}`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }
    );

    if (response.status === 404) return [];

    if (!response.ok) {
        const errorBody = await response.text().catch(() => null);
        throw new Error(
            `Failed to fetch work experiences: ${response.status} ${errorBody ?? response.statusText}`
        );
    }

    return response.json();
}

export async function getAllWorkExperiences(): Promise<WorkExperience[]> {
    const response = await fetch(`${process.env.SPRING_API_URL}/api/v1/work-experiences`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => null);
        throw new Error(
            `Failed to fetch work experiences: ${response.status} ${errorBody ?? response.statusText}`
        );
    }

    return response.json();
}

export async function getWorkExperienceById(id: number): Promise<WorkExperience | null> {
    const response = await fetch(`${process.env.SPRING_API_URL}/api/v1/work-experiences/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (response.status === 404) return null;

    if (!response.ok) {
        const errorBody = await response.text().catch(() => null);
        throw new Error(
            `Failed to fetch work experience: ${response.status} ${errorBody ?? response.statusText}`
        );
    }

    return response.json();
}

export async function updateWorkExperience(
    id: number,
    payload: WorkExperiencePayload
): Promise<WorkExperience> {
    const response = await fetch(`${process.env.SPRING_API_URL}/api/v1/work-experiences/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => null);
        throw new Error(
            `Failed to update work experience: ${response.status} ${errorBody ?? response.statusText}`
        );
    }

    return response.json();
}

export async function deleteWorkExperience(id: number): Promise<void> {
    const response = await fetch(`${process.env.SPRING_API_URL}/api/v1/work-experiences/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => null);
        throw new Error(
            `Failed to delete work experience: ${response.status} ${errorBody ?? response.statusText}`
        );
    }
}