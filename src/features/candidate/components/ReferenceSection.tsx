"use client";

import { useEffect } from "react";
import * as Yup from "yup";
import { DynamicEntrySection } from "@/src/components/seeker/DynamicEntrySection";
import { EntryFieldConfig } from "@/src/types/dynamic-entry";
import useReference from "@/src/features/candidate/reference/useReference";
import { ReferencePayload } from "@/src/features/candidate/reference/types";
import useCandidate from "../useCandidate";
import LoadingOverlay from "@/src/components/common/LoadingOverlay";
import useUser from "../../users/useUser";

const emptyValues = {
    fullName: "",
    position: "",
    companyName: "",
    email: "",
    phoneNumber: "",
};

const validationSchema = Yup.object({
    fullName: Yup.string().trim().required("Full name is required"),
    position: Yup.string().trim().required("Position is required"),
    companyName: Yup.string().trim().required("Company is required"),
    email: Yup.string().trim().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
        .trim()
        .matches(/^[0-9+\-\s]{8,15}$/, "Invalid phone number")
        .required("Phone number is required"),
});

const fields: EntryFieldConfig[] = [
    { name: "fullName", label: "Full Name", type: "text", gridSpan: 1 },
    { name: "position", label: "Position", type: "text", gridSpan: 1 },
    { name: "companyName", label: "Company", type: "text", gridSpan: 1 },
    { name: "email", label: "Email", type: "email", gridSpan: 1 },
    { name: "phoneNumber", label: "Phone Number", type: "text", gridSpan: 1 },
];

export default function ReferenceSection() {
    const { user } = useUser();
    const { current } = useCandidate();
    const candidateId = current?.candidateId;

    const {
        list,
        loading,
        getReferenceByCandidateId,
        createReference,
        updateReference,
        deleteReference,
    } = useReference();

    useEffect(() => {
        if (candidateId) {
            getReferenceByCandidateId(candidateId).catch(() => { });
        }
    }, [candidateId]);

    const entries = list.map((item) => ({
        ...item,
        id: item.referenceId,
    }));

    return (
        <div>
            <LoadingOverlay show={loading} />
            <DynamicEntrySection
                title="References"
                entries={entries}
                fields={fields}
                validationSchema={validationSchema}
                emptyValues={emptyValues}
                getTitle={(e) => e.fullName}
                getSubtitle={(e) =>
                    [
                        [e.position, e.companyName].filter(Boolean).join(" at "),
                        [e.email, e.phoneNumber].filter(Boolean).join(" · "),
                    ]
                        .filter(Boolean)
                        .join("\n")
                }
                onCreate={async (values) => {
                    if (!candidateId) return;
                    await createReference(candidateId, {
                        ...values,
                        candidateId,
                        createdBy: user?.name ?? "",
                    } as ReferencePayload);
                }}
                onUpdate={async (id, values) => {
                    if (!candidateId) return;
                    const existing = list.find((r) => r.referenceId === id);
                    await updateReference(id, {
                        ...values,
                        candidateId,
                        createdBy: existing?.createdBy ?? "",
                    } as ReferencePayload);
                }}
                onDelete={async (id) => {
                    await deleteReference(id);
                }}
            />
        </div>
    );
}