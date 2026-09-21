import axios from "axios";
import { Candidate } from "./slice";

export const reqGetCandidates = () => axios.get<Candidate[]>(`/candidates`);

export const reqGetCandidateById = (payload: { id: number }) =>
    axios.get<Candidate>(`/candidates/${payload.id}`);

export const reqGetCandidateByUserId = (payload: { id: string }) =>
    axios.get<Candidate>(`/candidates/user/${payload.id}`);

export const reqCreateCandidate = (payload: Candidate) =>
    axios.post<Candidate>(`/candidates`, payload);

export const reqUpdateCandidate = (candidateId: number, payload: Candidate) =>
    axios.put<Candidate>(`/candidates/${candidateId}`, payload);