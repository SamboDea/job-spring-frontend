import axios from "axios"
import { ReferencePayload, ReferenceResponse } from "./types"

export const reqGetAllReference = () => {
    return axios.get<ReferenceResponse[]>(`references`);
}

export const reqGetReferenceByCandidateId = (candidateId: number) => {
    return axios.get<ReferenceResponse[]>(`references/candidate/${candidateId}`);
}

export const reqGetReferenceById = (referenceId: number) => {
    return axios.get<ReferenceResponse[]>(`references/${referenceId}`);
}

export const reqCreateReference = (candidateId: number, payload: ReferencePayload) => {
    return axios.post<ReferenceResponse[]>(`references/candidate/${candidateId}`, payload);
}

export const reqUpdateReference = (referenceId: number, payload: ReferencePayload) => {
    return axios.put<ReferenceResponse[]>(`references/${referenceId}`, payload);
}

export const reqDeleteReference = (referenceId: number) => {
    return axios.delete<ReferenceResponse[]>(`references/${referenceId}`);
}