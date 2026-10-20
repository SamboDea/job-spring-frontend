export interface SkillRes {
    skillId: number;
    skillName: string;
    createdBy: number;
    description: string | null;
    createdDate: string;
}

export interface SkillPayload {
    skillName: string;
    createdBy: number;
    description?: string;
}