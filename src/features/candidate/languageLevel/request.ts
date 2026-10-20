import axios from "axios"
import { LanguageLevelResponse, LanguageLevelPayload } from "./types"

export const reqGetLanguageLevel = () => {
    return axios.get<LanguageLevelResponse[]>('/language-levels')
}

export const reqGetLanguageLevelById = (id: string) => {
    return axios.get<LanguageLevelResponse>(`/language-levels/${id}`)
}

export const reqCreateLanguageLevel = (payload: LanguageLevelPayload) => {
    return axios.post<LanguageLevelResponse>(`/language-levels`, payload)
}

export const reqUpdateLanguageLevel = (id: string, payload: LanguageLevelPayload) => {
    return axios.put<LanguageLevelResponse>(`/language-levels/${id}`, payload)
}

export const reqDeleteLanguageLevel = (id: string) => {
    return axios.delete<LanguageLevelResponse>(`/language-levels/${id}`)
}