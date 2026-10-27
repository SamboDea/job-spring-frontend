export interface CvData {
    profile?: string;
    fullName: string;
    title?: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
    experience: {
        company: string;
        position: string;
        startDate: string;
        endDate?: string;
        jobResponsibility?: string[];
    }[];
    education: {
        school: string;
        degree: string;
        startDate: string;
        endDate?: string;
    }[];
    skills: string[];
    languages: { name: string; level?: string }[];
    achievements: { title: string; date?: string; description?: string }[];
    references: {
        name: string;
        position?: string;
        company?: string;
        email?: string;
        phone?: string;
    }[];
}