import axios from "axios"
import { LanguagePayload, LanguageResponse } from "./types"

export const reqGetLanguageByCandidateId = (candidateId: number) => {
    return axios.get<LanguageResponse[]>(`/languages/candidate/${candidateId}`)
}

export const reqCreateLanguage = (payload: LanguagePayload) => {
    return axios.post<LanguageResponse>(`/languages`, payload)
}

export const reqCreateLanguages = (payload: LanguagePayload[]) => {
    return axios.post<LanguageResponse[]>(`/languages/multiple`, payload)
}

export const reqUpdateLanguage = (candidateId: number, languageId: string, payload: LanguagePayload) => {
    return axios.put<LanguageResponse>(`/languages/candidate/${candidateId}/${languageId}`, payload)
}

export const reqDeleteLanguage = (candidateId: number, languageId: string) => {
    return axios.delete<LanguageResponse>(`/languages/candidate/${candidateId}/${languageId}`)
}