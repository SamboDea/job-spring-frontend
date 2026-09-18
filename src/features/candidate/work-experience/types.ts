export interface WorkExperienceItem {
    workExperienceId?: number;
    companyName: string;
    jobTitle: string;
    jobLevelId: number | null;
    typeOfExperienceId: number | null;
    startDate: string | null;
    endDate: string | null;
    isCurrent: boolean;
    city?: string | null;
    country?: string | null;
    jobResponsibility: string | null;
}

export interface WorkExperienceFormValues {
    workExperience: WorkExperienceItem[];
}

export const initialEmptyWorkExperience: WorkExperienceItem = {
    companyName: "",
    jobTitle: "",
    jobLevelId: null,
    typeOfExperienceId: null,
    startDate: null,
    endDate: null,
    isCurrent: false,
    city: null,
    country: null,
    jobResponsibility: "",
};