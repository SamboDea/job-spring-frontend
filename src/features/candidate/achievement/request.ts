import axios from "axios"
import type { AchievementRes } from "./types"

export const reqGetAchievements = () => {
    return axios.get<AchievementRes[]>(`/achievements`)
}

export const reqGetAchievementById = (achievementId: string) => {
    return axios.get<AchievementRes>(`/achievements/${achievementId}`)
}

export const reqGetAchievementByCandidateId = (candidateId: string) => {
    return axios.get<AchievementRes[]>(`/achievements/candidate/${candidateId}`)
}

export const reqCreateCandidateAchievement = (payload: AchievementRes) => {
    return axios.post<AchievementRes>(`/achievements`, payload)
}

export const reqUpdateCandidateAchievement = (achievementId: string, payload: AchievementRes) => {
    return axios.put<AchievementRes>(`/achievements/${achievementId}`, payload)
}

export const reqDeleteCandidateAchievement = (achievementId: string) => {
    return axios.delete<AchievementRes>(`/achievements/${achievementId}`)
}