export type PersonalInfoValues = {
    name: string;
    email: string;
    gender: string | null;
    contactNumber: string;
    dateOfBirth: string | null;
    country: string | null;
    city: string | null;
    jobTitle: string;
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
    jobTitle: "",
    industry: null,
    github: "",
    linkedin: "",
    portfolio: "",
    description: "",
    address: "",
};