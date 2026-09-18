import { useEffect, useState } from "react";
import { authClient } from "@/src/lib/auth-client";
import {
    createCandidate,
    updateCandidate,
    getCandidateByUserId,
    type CandidatePayload,
} from "@/src/features/candidate/personal-information/action";
import { emptyValues, type PersonalInfoValues } from "@/src/features/candidate/personal-information/types";

function toPayload(values: PersonalInfoValues): CandidatePayload {
    return {
        gender: values.gender || null,
        contactNumber: values.contactNumber || null,
        dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth).toISOString() : null,
        country: values.country || null,
        city: values.city || null,
        jobTitle: values.jobTitle || null,
        industry: values.industry || null,
        githubUsername: values.github || null,
        linkedinUsername: values.linkedin || null,
        portfolio: values.portfolio || null,
        description: values.description || null,
        address: values.address || null,
    };
}

export function usePersonalInfoForm() {
    const { data: session } = authClient.useSession();
    const [candidateId, setCandidateId] = useState<number | null>(null);
    const [initialValues, setInitialValues] = useState<PersonalInfoValues>(emptyValues);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user?.id) return;

        getCandidateByUserId(session.user.id)
            .then((candidate) => {
                setCandidateId(candidate?.candidateId ?? null);
                setInitialValues((prev) => ({
                    ...prev,
                    name: session.user.name ?? "",
                    email: session.user.email ?? "",
                    gender: candidate?.gender ?? null,
                    contactNumber: candidate?.contactNumber ?? "",
                    dateOfBirth: candidate?.dateOfBirth ?? null,
                    country: candidate?.country ?? null,
                    city: candidate?.city ?? null,
                    jobTitle: candidate?.jobTitle ?? "",
                    industry: candidate?.industry ?? null,
                    github: candidate?.githubUsername ?? "",
                    linkedin: candidate?.linkedinUsername ?? "",
                    portfolio: candidate?.portfolio ?? "",
                    description: candidate?.description ?? "",
                    address: candidate?.address ?? "",
                }));
            })
            .catch((err) => console.error("Failed to load candidate", err))
            .finally(() => setLoading(false));
    }, [session?.user?.id, session?.user?.name, session?.user?.email]);

    async function submit(values: PersonalInfoValues) {
        if (!session?.user?.id) {
            throw new Error("No authenticated user");
        }

        const payload = toPayload(values);

        if (candidateId) {
            const updated = await updateCandidate(candidateId.toString(), payload);
            setCandidateId(updated.candidateId);
        } else {
            const created = await createCandidate(payload, session.user.id);
            setCandidateId(created.candidateId);
        }
        // name/email are session-level, not Candidate fields —
        // update those via authClient.updateUser({ name, email }) here
        // if you want those edits to persist too.
    }

    return { initialValues, loading, submit };
}