"use client";

import { useEffect } from "react";
import { DynamicEntrySection } from "@/src/components/seeker/DynamicEntrySection";
import { EntryFieldConfig } from "@/src/types/dynamic-entry";
import useWorkExperience from "@/src/features/candidate/work-experience/useWorkExperience";
import { WorkExperiencePayload } from "@/src/features/candidate/work-experience/types";
import useCandidate from "../useCandidate";
import useUser from "../../users/useUser";
import { validationSchema } from "../work-experience/validation";
import LoadingOverlay from "@/src/components/common/LoadingOverlay";

const COUNTRY_OPTIONS = ["Cambodia", "Kampuchea", "United States", "Singapore"];
const CITY_OPTIONS = ["Phnom Penh", "Siem Reap", "Sihanoukville", "Banteay Meanchey"];

const fields: EntryFieldConfig[] = [
    { name: "jobTitle", label: "Job Title", type: "text", gridSpan: 1 },
    { name: "companyName", label: "Company Name", type: "text", gridSpan: 1 },
    { name: "country", label: "Country", type: "autocomplete", options: COUNTRY_OPTIONS, gridSpan: 1 },
    { name: "city", label: "City", type: "autocomplete", options: CITY_OPTIONS, gridSpan: 1 },
    { name: "startDate", label: "Start Date", type: "date", gridSpan: 1 },
    {
        name: "endDate",
        label: "End Date",
        type: "date",
        gridSpan: 1,
        disableWhen: (values) => !!values.isCurrent,
    },
    { name: "isCurrent", label: "I currently work here", type: "checkbox", gridSpan: 2 },
    { name: "jobResponsibility", label: "Job Responsibilities", type: "richtext", gridSpan: 2 },
];

const emptyValues: Omit<WorkExperiencePayload, "candidateId"> = {
    jobTitle: "",
    companyName: "",
    country: null,
    city: null,
    startDate: "",
    endDate: null,
    isCurrent: false,
    jobResponsibility: null,
};

export default function WorkExperienceSection({ candidateId }: { candidateId?: number }) {
    const { user } = useUser();
    const createdBy = user?.name;

    const {
        list,
        loading,
        getWorkExperiencesByCandidateId,
        createWorkExperience,
        updateWorkExperience,
        deleteWorkExperience,
    } = useWorkExperience();

    useEffect(() => {
        if (candidateId) {
            getWorkExperiencesByCandidateId(candidateId).catch(() => { });
        }
    }, [candidateId]);

    const entries = list.map((item) => ({ ...item, id: item.workExperienceId }));

    return (
        <div>
            <LoadingOverlay show={loading} />
            <DynamicEntrySection
                title="Work Experience"
                entries={entries}
                fields={fields}
                validationSchema={validationSchema}
                emptyValues={emptyValues}
                getTitle={(e) => e.jobTitle}
                getSubtitle={(e) => e.companyName}
                getStartDate={(e) => e.startDate}
                getEndDate={(e) => e.endDate}
                getIsCurrent={(e) => e.isCurrent}
                onCreate={(values) => {
                    if (!candidateId) return Promise.resolve();
                    return createWorkExperience(
                        { ...values, candidateId, createdBy, } as WorkExperiencePayload,
                    ).then(() => { });
                }}
                onUpdate={(id, values) => updateWorkExperience(id, values).then(() => { })}
                onDelete={(id) => deleteWorkExperience(id)}
            />
        </div>
    );
}