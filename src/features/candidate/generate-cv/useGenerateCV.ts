import useCandidate from "@/src/features/candidate/useCandidate";
import useWorkExperience from "@/src/features/candidate/work-experience/useWorkExperience";
import useEducation from "@/src/features/candidate/education/useEducation";
import useSkill from "@/src/features/candidate/skills/useSkill";
import useLanguage from "@/src/features/candidate/languages/useLanguage";
import useAchievement from "@/src/features/candidate/achievement/useAchievement";
import useReference from "@/src/features/candidate/reference/useReference";

import type { CvData } from "./types";
import { formatMonthYear, toLines } from "@/src/lib/utils";
import useUser from "../../users/useUser";
import { authClient } from "@/src/lib/auth-client";

export default function useGenerateCV() {
    const { current } = useCandidate();
    const { user: account } = useUser()
    const { data: session } = authClient.useSession();
    const image = session?.user?.image;
    const { list: experiences = [] } = useWorkExperience();
    const { list: educations = [] } = useEducation();
    const { list: skills = [] } = useSkill();
    const { list: languages = [] } = useLanguage();
    const { list: achievements = [] } = useAchievement();
    const { list: references = [] } = useReference();

    const isReady = !!current && (experiences.length > 0 || educations.length > 0);

    const build = (): CvData | null => {
        if (!current) return null;

        return {
            profile: image
                ? `https://jobapplication-storage.s3.ap-southeast-1.amazonaws.com/profiles/${account?.id}/profile.jpg`
                : "",
            fullName: `${account?.name ?? ""}`.trim(),
            title: experiences[0]?.jobTitle,
            email: account?.email ?? "",
            phone: current.contactNumber ?? "",
            location: current.address ?? "",
            summary: current.description ?? "",

            experience: experiences.map((e) => ({
                company: e.companyName,
                position: e.jobTitle,
                startDate: formatMonthYear(e.startDate) ?? "",
                endDate: formatMonthYear(e.endDate),
                jobResponsibility: toLines(e.jobResponsibility),
            })),

            education: educations.map((e) => ({
                school: e.institution,
                degree: e.educationLevelName,
                startDate: formatMonthYear(e.startDate) ?? "",
                endDate: formatMonthYear(e.endDate),
                major: e.majorName,
            })),

            skills: skills.map((s) => s.skillName),

            languages: languages.map((l) => ({
                name: l.languageName,
                level: l.languageLevelName,
            })),

            achievements: achievements.map((a) => ({
                title: a.title,
                date: formatMonthYear(a.achievementDate),
                description: a.description,
            })),

            references: references.map((r) => ({
                name: r.fullName,
                position: r.position,
                company: r.companyName,
                email: r.email,
                phone: r.phoneNumber,
            })),
        };
    };

    return { build, isReady };
}