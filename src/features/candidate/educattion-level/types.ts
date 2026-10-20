export interface EducationLevel {
    educationLevelId: number;
    name: string;
    createdBy: string;
    isDeleted: boolean;
    createDate: string;
}

export interface EducationLevelPayload {
    name: string;
    createdBy: string;
}