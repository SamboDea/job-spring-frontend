"use client";

import { useEffect, useMemo } from "react";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { DynamicEntrySection } from "@/src/components/seeker/DynamicEntrySection";
import { EntryFieldConfig } from "@/src/types/dynamic-entry";
import useLanguage from "@/src/features/candidate/languages/useLanguage";
import useLanguageLevel from "@/src/features/candidate/languageLevel/useLanguageLevel";
import useCandidate from "../useCandidate";
import LoadingOverlay from "@/src/components/common/LoadingOverlay";

const LANGUAGE_OPTIONS = [
    "Khmer", "English", "Chinese (Mandarin)", "Thai", "Vietnamese", "Japanese",
    "Korean", "French", "German", "Spanish", "Malay", "Indonesian",
];

const emptyValues = { name: "", level: "" };

const validationSchema = Yup.object({
    name: Yup.string().trim().required("Choose a language"),
    level: Yup.string().required("Choose a level"),
});

const normalize = (s: string | null | undefined) => (s ?? "").trim().toLowerCase();

export default function LanguageSection() {
    const { current } = useCandidate();
    const candidateId = current?.candidateId;

    const { list: languageLevelList, getLanguageLevel } = useLanguageLevel();
    const {
        list,
        loading,
        getLanguageByCandidateId,
        createLanguage,
        updateLanguage,
        deleteLanguage,
    } = useLanguage();

    useEffect(() => {
        getLanguageLevel();
    }, []);

    useEffect(() => {
        if (candidateId) getLanguageByCandidateId(candidateId);
    }, [candidateId]);

    const levelOptions = useMemo(
        () => languageLevelList.map((lvl) => lvl.languageLevelName),
        [languageLevelList]
    );

    const levelLabelToId = useMemo(
        () => Object.fromEntries(languageLevelList.map((lvl) => [lvl.languageLevelName, lvl.languageLevelId])),
        [languageLevelList]
    );

    const fields: EntryFieldConfig[] = [
        { name: "name", label: "Language", type: "autocomplete", options: LANGUAGE_OPTIONS, freeSolo: true, gridSpan: 1 },
        { name: "level", label: "Proficiency level", type: "autocomplete", options: levelOptions, gridSpan: 1 },
    ];

    // DynamicEntrySection needs numeric ids and sorts them descending.
    // id = list.length - index keeps the server order and works with string/UUID languageIds.
    const entries = list.map((item, i) => ({
        ...item,
        id: list.length - i,
        name: item.languageName ?? "",
        level: item.languageLevelName ?? "",
    }));

    const findByEntryId = (id: number) => list[list.length - id];

    const showError = (text: string) => Swal.fire({ icon: "error", title: "Error", text });

    const isDuplicate = (name: string, ignoreLanguageId?: string) =>
        list.some(
            (l) =>
                l.languageId !== ignoreLanguageId &&
                normalize(l.languageName) === normalize(name)
        );

    const buildPayload = (values: Record<string, any>) => {
        const languageLevelId = levelLabelToId[values.level];
        if (!languageLevelId) {
            showError("Please select a valid proficiency level from the list.");
            return null;
        }
        return {
            candidateId: candidateId as number,
            languageName: String(values.name).trim(),
            languageLevelId,
        };
    };

    return (
        <div>
            <LoadingOverlay show={loading} />
            <DynamicEntrySection
                title="Languages"
                entries={entries}
                fields={fields}
                validationSchema={validationSchema}
                emptyValues={emptyValues}
                getTitle={(e) => e.name}
                getSubtitle={(e) => e.level}
                onCreate={async (values) => {
                    if (!candidateId) return;
                    if (isDuplicate(values.name)) {
                        await showError("This language is already added.");
                        return;
                    }
                    const payload = buildPayload(values);
                    if (!payload) return;

                    const res = await createLanguage(payload);
                    if (res) await getLanguageByCandidateId(candidateId);
                }}
                onUpdate={async (id, values) => {
                    if (!candidateId) return;
                    const target = findByEntryId(id);
                    if (!target) return;
                    if (isDuplicate(values.name, target.languageId)) {
                        await showError("This language is already added.");
                        return;
                    }
                    const payload = buildPayload(values);
                    if (!payload) return;

                    const res = await updateLanguage(candidateId, target.languageId, payload);
                    if (res) await getLanguageByCandidateId(candidateId);
                }}
                onDelete={async (id) => {
                    if (!candidateId) return;
                    const target = findByEntryId(id);
                    if (!target) return;

                    const res = await deleteLanguage(candidateId, target.languageId);
                    if (res !== null) await getLanguageByCandidateId(candidateId);
                }}
            />
        </div>
    );
}