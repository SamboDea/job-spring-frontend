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
