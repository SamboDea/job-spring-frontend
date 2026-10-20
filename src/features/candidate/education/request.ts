import { Education, EducationPayload } from "@/src/features/candidate/education/types";
import axios from "axios";

export const reqGetEducationsByCandidateId = ({ candidateId }: { candidateId: number }) =>
    axios.get<Education[]>(`/educations/candidate/${candidateId}`);

export const reqGetEducation = ({ educationId }: { educationId: number }) =>
    axios.get<Education>(`/educations/${educationId}`);

export const reqCreateEducation = (data: EducationPayload) =>
    axios.post<Education>("/educations", data);

export const reqCreateEducations = (data: EducationPayload[]) =>
    axios.post<Education[]>("/educations/multiple", data);

export const reqUpdateEducation = ({ id, data }: { id: number; data: EducationPayload }) =>
    axios.put<Education>(`/educations/${id}`, data);

export const reqDeleteEducation = ({ id }: { id: number }) =>
    axios.delete(`/educations/${id}`);