export interface ReferencePayload {
    candidateId: number;
    fullName: string;
    email: string;
    position: string;
    phoneNumber: string;
    companyName: string;
    createdBy: string;
}

export interface ReferenceResponse {
    referenceId: number;
    candidateId: number;
    fullName: string;
    position: string;
    companyName: string;
    phoneNumber: string;
    email: string;
    createdBy: string;
    createDate: string;
}