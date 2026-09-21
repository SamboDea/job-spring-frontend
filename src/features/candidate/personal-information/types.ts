export type PersonalInfoValues = {
    name: string;
    email: string;
    gender: string | null;
    contactNumber: string;
    dateOfBirth: string | null;
    country: string | null;
    city: string | null;
    jobTitle: string | null;
    industry: string | null;
    github: string;
    linkedin: string;
    portfolio: string;
    description: string;
    address: string;
};

export const emptyValues: PersonalInfoValues = {
    name: "",
    email: "",
    gender: null,
    contactNumber: "",
    dateOfBirth: null,
    country: null,
    city: null,
    jobTitle: null,
    industry: null,
    github: "",
    linkedin: "",
    portfolio: "",
    description: "",
    address: "",
};

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
