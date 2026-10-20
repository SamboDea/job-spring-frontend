import axios from "axios"
import { SkillRes, SkillPayload } from "./types"

export const reqGetSkills = () => {
    return axios.get<SkillRes[]>('/skills')
}

export const reqGetSkillById = (skillId: string) => {
    return axios.get<SkillRes>(`/skills/${skillId}`)
}

export const reqGetCandidateSkills = (candidateId: string) => {
    return axios.get<SkillRes[]>(`/skills/candidate/${candidateId}`)
}

export const reqCreateSkill = (skill: SkillPayload) => {
    return axios.post<SkillRes>('/skills', skill)
}

export const reqCreateSkills = (skill: SkillPayload[]) => {
    return axios.post<SkillRes[]>(`/skills/create-multiple`, skill)
}

export const reqUpdateCandidateSkill = (candidateId: string, skillId: string, skill: SkillPayload) => {
    return axios.put<SkillRes>(`/skills/candidate/${candidateId}/${skillId}`, skill)
}

export const reqDeleteSkill = (skillId: string) => {
    return axios.delete<SkillRes>(`/skills/${skillId}`)
}

export const reqDeleteCandidateSkill = (candidateId: string, skillId: string) => {
    return axios.delete(`/skills/candidate/${candidateId}/${skillId}`)
}