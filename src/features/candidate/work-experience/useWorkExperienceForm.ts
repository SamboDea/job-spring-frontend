"use client";

import { useEffect, useState, useCallback } from "react";
import { authClient } from "@/src/lib/auth-client";
import { getCandidateByUserId } from "@/src/features/candidate/personal-information/action";
import {
    createMultipleWorkExperiences,
    updateWorkExperience,
    getWorkExperiencesByCandidateId,
    type WorkExperiencePayload,
    type WorkExperience,
} from "@/src/features/candidate/work-experience/action";
import type {
    WorkExperienceFormValues,
    WorkExperienceItem,
} from "@/src/features/candidate/work-experience/types";

function toFormItem(record: WorkExperience): WorkExperienceItem {
    return {
        workExperienceId: record.workExperienceId,
        companyName: record.companyName ?? "",
        jobTitle: record.jobTitle ?? "",
        jobLevelId: record.jobLevelId ?? null,
        typeOfExperienceId: record.typeOfExperienceId ?? null,
        startDate: record.startDate ?? null,
        endDate: record.endDate ?? null,
        isCurrent: record.isCurrent ?? false,
        city: record.city ?? null,
        country: record.country ?? null,
        jobResponsibility: record.jobResponsibility ?? "",
    };
}

function toPayload(
    item: WorkExperienceItem,
    candidateId: number,
    createdBy: string
): WorkExperiencePayload {
    return {
        candidateId,
        jobTitle: item.jobTitle,
        jobLevelId: item.jobLevelId,
        companyName: item.companyName,
        typeOfExperienceId: item.typeOfExperienceId,
        city: item.city || null,
        country: item.country || null,
        startDate: item.startDate ? formatDateOnly(item.startDate) : "",
        endDate: item.isCurrent ? null : (item.endDate ? formatDateOnly(item.endDate) : null),
        isCurrent: item.isCurrent,
        jobResponsibility: item.jobResponsibility || null,
        createdBy,
    };
}

function formatDateOnly(value: string): string {
    const date = new Date(value);
    return date.toISOString().split("T")[0];
}

export function useWorkExperienceForm() {
    const { data: session } = authClient.useSession();
    const [candidateId, setCandidateId] = useState<number | null>(null);
    const [initialData, setInitialData] = useState<WorkExperienceItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.id) return;

        (async () => {
            try {
                const candidate = await getCandidateByUserId(session.user.id);
                if (!candidate) {
                    setCandidateId(null);
                    setInitialData([]);
                    return;
                }

                setCandidateId(candidate.candidateId);
                const experiences = await getWorkExperiencesByCandidateId(candidate.candidateId);
                setInitialData(experiences.map(toFormItem));
            } catch (err) {
                console.error("Failed to load work experiences", err);
            } finally {
                setLoading(false);
            }
        })();
    }, [session?.user?.id]);

    const submit = useCallback(
        async (values: WorkExperienceFormValues) => {
            if (!session?.user?.id) {
                throw new Error("No authenticated user");
            }
            if (!candidateId) {
                throw new Error("Candidate profile must be created before adding work experience");
            }

            const createdBy = session.user.id;

            // Split into existing (has workExperienceId → update) vs new (no id → create)
            const existingItems = values.workExperience.filter((item) => item.workExperienceId != null);
            const newItems = values.workExperience.filter((item) => item.workExperienceId == null);

            const updatePromises = existingItems.map((item) =>
                updateWorkExperience(item.workExperienceId!, toPayload(item, candidateId, createdBy))
            );

            const createPromise =
                newItems.length > 0
                    ? createMultipleWorkExperiences(
                        newItems.map((item) => toPayload(item, candidateId, createdBy))
                    )
                    : Promise.resolve([]);

            const [updateResults, createResults] = await Promise.all([
                Promise.all(updatePromises),
                createPromise,
            ]);

            // Refresh local state with the server's returned records
            // (so newly created items pick up their workExperienceId)
            setInitialData([...updateResults, ...createResults].map(toFormItem));
        },
        [session?.user?.id, candidateId]
    );

    return { initialData, loading, submit, candidateId };
}