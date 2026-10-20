"use client";

import { useEffect } from "react";
import { DynamicEntrySection } from "@/src/components/seeker/DynamicEntrySection";
import { EntryFieldConfig } from "@/src/types/dynamic-entry";
import useAcheivement from "@/src/features/candidate/achievement/useAchievement";
import { AchievementPayload, AchievementRes } from "@/src/features/candidate/achievement/types";
import useCandidate from "../useCandidate";
import useUser from "@/src/features/users/useUser";
import { validationSchema } from "@/src/features/candidate/achievement/validation";
import LoadingOverlay from "@/src/components/common/LoadingOverlay";
import { htmlToStructuredText } from "@/src/lib/utils";

const fields: EntryFieldConfig[] = [
    { name: "title", label: "Achievement Title", type: "text", gridSpan: 2 },
    { name: "achievementDate", label: "Achievement Date", type: "date", gridSpan: 2 },
    { name: "description", label: "Description", type: "richtext", gridSpan: 2 },
];

const emptyValues: Omit<AchievementPayload, "candidateId" | "createdBy"> = {
    title: "",
    achievementDate: "",
    description: "",
};

export default function AchievementSection() {
    const { current } = useCandidate();
    const { user } = useUser();
    const candidateId = current?.candidateId;
    const createdBy = user?.name ?? "1";

    const {
        list,
        loading,
        getAchievementByCandidateId,
        createAchievement,
        updateAchievement,
        deleteAchievement,
    } = useAcheivement();

    useEffect(() => {
        if (candidateId) {
            getAchievementByCandidateId(candidateId).catch(() => { });
        }
    }, [candidateId]);

    const entries = list.map((item) => ({
        ...item,
        id: item.achievementId,
    }));

    return (
        <div>
            <LoadingOverlay show={loading} />
            <DynamicEntrySection
                title="Achievements"
                entries={entries}
                fields={fields}
                validationSchema={validationSchema}
                emptyValues={emptyValues}
                getTitle={(e) => e.title}
                getSubtitle={(e) => e.description}
                getStartDate={(e) => e.achievementDate}
                onCreate={(values): Promise<void> => {
                    if (!candidateId) return Promise.resolve();
                    const payload: AchievementRes = {
                        achievementId: 0,
                        candidateId: Number(candidateId),
                        title: values.title,
                        achievementDate: values.achievementDate,
                        description: htmlToStructuredText(values.description),
                        createdBy,
                        createdDate: "",
                    };
                    return createAchievement(payload).then(() => undefined);
                }}
                onUpdate={(id, values): Promise<void> => {
                    if (!candidateId) return Promise.resolve();
                    const original = list.find((a) => a.achievementId === Number(id));
                    if (!original) return Promise.resolve();

                    const payload: AchievementRes = {
                        ...original,
                        title: values.title,
                        achievementDate: values.achievementDate,
                        description: values.description,
                    };
                    return updateAchievement(Number(id), payload).then(() => undefined);
                }}
                onDelete={(id): Promise<void> =>
                    deleteAchievement(id).then(() => undefined)
                }
            />
        </div>
    );
}