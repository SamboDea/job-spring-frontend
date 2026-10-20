"use client";

import { useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { DynamicEntrySection } from "@/src/components/seeker/DynamicEntrySection";
import { EntryFieldConfig } from "@/src/types/dynamic-entry";
import useEducation from "@/src/features/candidate/education/useEducation";
import { EducationPayload } from "@/src/features/candidate/education/types";
import useCandidate from "../useCandidate";
import { validationSchema } from "@/src/features/candidate/education/validation";
import useEducationLevel from "../educattion-level/useEducationLevel";
import LoadingOverlay from "@/src/components/common/LoadingOverlay";
import useMajor from "../major/useMajor";
import useCountry from "../../country/useConutry";

const CITY_OPTIONS = ["Phnom Penh", "Siem Reap", "Sihanoukville", "Banteay Meanchey"];

const emptyValues = {
    institution: "",
    educationLevel: "",
    majorName: "",
    country: "",
    city: "",
    startDate: "",
    endDate: null as string | null,
    isCurrent: false,
};

export default function EducationSection() {
    const { current } = useCandidate();
    const { list: majorList, getMajorList } = useMajor();
    const { list: countryList, getCountry } = useCountry();
    const candidateId = current?.candidateId;
    const { list: eduLevelList, getEducationLevels } = useEducationLevel();

    useEffect(() => {
        getEducationLevels().catch(() => { });
        getMajorList().catch(() => { });
        getCountry().catch(() => { });
    }, []);

    const educationLevelOptions = useMemo(
        () => eduLevelList.map((lvl) => lvl.name),
        [eduLevelList]
    );

    const majorOptions = useMemo(
        () => majorList.map((m) => m.name),
        [majorList]
    );

    const labelToId = useMemo(
        () => Object.fromEntries(eduLevelList.map((lvl) => [lvl.name, lvl.educationLevelId])),
        [eduLevelList]
    );

    const countryOptions = useMemo(
        () => countryList.map((c) => c.name),
        [countryList]
    );

    const fields: EntryFieldConfig[] = [
        { name: "institution", label: "Institution", type: "text", gridSpan: 1 },
        {
            name: "educationLevel",
            label: "Education Level",
            type: "autocomplete",
            options: educationLevelOptions,
            gridSpan: 1,
        },
        {
            name: "majorName",
            label: "Major",
            type: "autocomplete",
            options: majorOptions,
            gridSpan: 1,
        },
        {
            name: "country",
            label: "Country",
            type: "autocomplete",
            options: countryOptions,
            gridSpan: 1,
        },
        {
            name: "city",
            label: "City",
            type: "autocomplete",
            options: CITY_OPTIONS,
            freeSolo: true, // user can override the capital with any city
            gridSpan: 1,
        },
        { name: "startDate", label: "Start Date", type: "date", gridSpan: 1 },
        {
            name: "endDate",
            label: "End Date",
            type: "date",
            gridSpan: 1,
            disableWhen: (values) => !!values.isCurrent,
        },
        { name: "isCurrent", label: "I currently study here", type: "checkbox", gridSpan: 2 },
    ];

    const {
        list,
        loading,
        getEducationsByCandidateId,
        createEducation,
        updateEducation,
        deleteEducation,
    } = useEducation();

    useEffect(() => {
        if (candidateId) {
            getEducationsByCandidateId(candidateId).catch(() => { });
        }
    }, [candidateId]);

    const entries = list.map((item) => ({
        ...item,
        id: item.educationId,
        educationLevel: item.educationLevelName ?? "",
    }));

    return (
        <div>
            <LoadingOverlay show={loading} />
            <DynamicEntrySection
                title="Education"
                entries={entries}
                fields={fields}
                validationSchema={validationSchema}
                emptyValues={emptyValues}
                getTitle={(e) => e.institution}
                getSubtitle={(e) => e.majorName}
                getStartDate={(e) => e.startDate}
                getEndDate={(e) => e.endDate}
                getIsCurrent={(e) => e.isCurrent}
                onCreate={(values) => {
                    if (!candidateId) return Promise.resolve();
                    const { educationLevel, ...rest } = values;
                    const educationLevelId = labelToId[educationLevel];

                    if (!educationLevelId) {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Please select a valid education level from the list.",
                        });
                        return Promise.resolve();
                    }

                    return createEducation({
                        ...rest,
                        educationLevelId,
                        candidateId,
                    } as EducationPayload).then(() => { });
                }}
                onUpdate={(id, values) => {
                    const { educationLevel, ...rest } = values;
                    const educationLevelId = labelToId[educationLevel];

                    if (!educationLevelId) {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Please select a valid education level from the list.",
                        });
                        return Promise.resolve();
                    }

                    return updateEducation(id, {
                        ...rest,
                        educationLevelId,
                    } as EducationPayload).then(() => { });
                }}
                onDelete={(id) => deleteEducation(id)}
            />
        </div>
    );
}