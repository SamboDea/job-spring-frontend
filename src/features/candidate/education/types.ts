export interface Education {
    educationId: number;
    candidateId: number;
    institution: string;
    educationLevelId: number;
    educationLevelName: string;
    majorId: number;
    majorName: string;
    city: string;
    country: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    createdBy: string | null;
    createdDate: string;
}

export interface EducationPayload {
    candidateId: number;
    institution: string;
    educationLevelId: number;
    majorName: string;
    city: string;
    country: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
}