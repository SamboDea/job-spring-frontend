import axios from "axios";
import { WorkExperience, WorkExperiencePayload } from "./types";

export const reqCreateWorkExperience = (payload: WorkExperiencePayload) =>
    axios.post<WorkExperience>("/work-experiences", payload);

export const reqCreateWorkExperiences = (
    payload: WorkExperiencePayload[]
) => axios.post<WorkExperience[]>("/work-experiences/multiple", payload);

export const reqGetWorkExperiences = () =>
    axios.get<WorkExperience[]>("/work-experiences");

export const reqGetWorkExperienceById = (id: number) =>
    axios.get<WorkExperience>(`/work-experiences/${id}`);

export const reqGetWorkExperiencesByCandidateId = (candidateId: number) =>
    axios.get<WorkExperience[]>(`/work-experiences/candidate/${candidateId}`);

export const reqUpdateWorkExperience = (
    id: number,
    payload: Partial<WorkExperiencePayload>
) => axios.put<WorkExperience>(`/work-experiences/${id}`, payload);

export const reqDeleteWorkExperience = (id: number) =>
    axios.delete(`/work-experiences/${id}`);