export interface WorkExperiencePayload {
    candidateId: number;
    jobTitle: string;
    jobLevelId?: number | null;
    companyName: string;
    typeOfExperienceId?: number | null;
    city?: string | null;
    country?: string | null;
    startDate: string;
    endDate?: string | null;
    isCurrent: boolean;
    jobResponsibility?: string | null;
    createdBy?: string;
}

export interface WorkExperience extends WorkExperiencePayload {
    workExperienceId: number;
    jobLevelName?: string | null;
    typeOfExperienceName?: string | null;
    isDeleted: boolean;
    createdAt: string;
}