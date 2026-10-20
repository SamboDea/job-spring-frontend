export interface AchievementPayload {
    candidateId: string,
    title: string,
    achievementDate: string,
    description: string,
    createdBy: string
}

export interface AchievementRes {
    achievementId: number,
    candidateId: number,
    title: string,
    achievementDate: string,
    description: string,
    createdBy: string
    createdDate: string
}