import axios from "axios";
import { EducationLevelPayload, EducationLevel } from "./types";

export const reqGetEducationLevels = () => {
    return axios.get<EducationLevel[]>("/education-levels")
}

export const reqGetEducationLevelById = ({ educationLevelId }: { educationLevelId: number }) => {
    return axios.get<EducationLevel>(`/education-levels/${educationLevelId}`);
}

export const reqCreateEducationLevel = (data: EducationLevelPayload) => {
    return axios.post<EducationLevel>("/education-levels", data)
}

export const reqUpdateEducationLevel = ({ educationLevelId, data }: { educationLevelId: number, data: EducationLevelPayload }) => {
    return axios.put<EducationLevel>(`/education-levels/${educationLevelId}`, data)
}

export const reqDeleteEducationLevel = ({ educationLevelId }: { educationLevelId: number }) => {
    return axios.delete(`/education-levels/${educationLevelId}`)
}