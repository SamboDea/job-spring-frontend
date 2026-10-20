"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Formik, Form } from "formik";
import { Box, Stack, Typography, Button, Chip, CircularProgress } from "@mui/material";
import Swal from "sweetalert2";
import { AutocompleteFormField } from "@/src/components/common/AppFormField";
import useSkill from "../skills/useSkill";
import useCandidate from "../useCandidate";

interface SkillFormValues {
    skills: string[];
}

const normalize = (name: string) => name.trim().toLowerCase();

export default function SkillSection() {

    const { list, candidateSkills: candidateSkillList, loading, getSkills, getCandidateSkills, createSkill, deleteCandidateSkill } = useSkill();
    const { current } = useCandidate();

    const candidateId = current?.candidateId;

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const savingRef = useRef(false);

    const candidateSkills: string[] = useMemo(
        () => candidateSkillList.map((s) => s.skillName),
        [candidateSkillList]
    );

    useEffect(() => {
        getSkills();
    }, []);

    useEffect(() => {
        if (candidateId) getCandidateSkills(candidateId);
    }, [candidateId]);

    // unique options (ignore case / spaces) so the dropdown never shows the same name twice
    const skillOptions = useMemo(() => {
        const seen = new Map<string, string>();
        list.forEach((s) => {
            const key = normalize(s.skillName);
            if (key && !seen.has(key)) seen.set(key, s.skillName.trim());
        });
        return [...seen.values()];
    }, [list]);

    const initialValues: SkillFormValues = { skills: candidateSkills };

    const handleSubmit = async (values: SkillFormValues) => {
        if (!candidateId || savingRef.current) return;

        // dedupe + trim what the user submitted
        const uniqueAfter = new Map<string, string>();
        values.skills.forEach((name) => {
            const key = normalize(name);
            if (key && !uniqueAfter.has(key)) uniqueAfter.set(key, name.trim());
        });

        const beforeSet = new Set(candidateSkills.map(normalize));

        const removed = candidateSkillList.filter((s) => !uniqueAfter.has(normalize(s.skillName)));
        const added = [...uniqueAfter.entries()]
            .filter(([key]) => !beforeSet.has(key))
            .map(([, name]) => name);

        savingRef.current = true;
        setSaving(true);
        let failed = false;
        try {
            for (const skill of removed) {
                await deleteCandidateSkill(candidateId, skill.skillId);
            }

            for (const name of added) {
                // createSkill already dispatches addSkill, so no dispatch here
                const res = await createSkill({ skillName: name, createdBy: candidateId });
                if (!res) failed = true;
            }

            await getCandidateSkills(candidateId);
            if (!failed) {
                if (removed.length || added.length) {
                    Swal.fire({ title: "Success", text: "Skills updated successfully", icon: "success" });
                }
                setEditing(false);
            }
        } finally {
            savingRef.current = false;
            setSaving(false);
        }
    };

    return (
        <Box>
            <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
                {({ values, resetForm, submitForm }) => (
                    <Form>
                        <Stack spacing={2}>
                            <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "16px" }}>
                                    Skills
                                </Typography>
                                {!editing ? (
                                    <Button
                                        size="small"
                                        onClick={() => setEditing(true)}
                                        sx={{ color: "#2BCDEF", background: "none", textTransform: "none" }}
                                    >
                                        Edit
                                    </Button>
                                ) : (
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            size="small"
                                            onClick={() => {
                                                resetForm();
                                                setEditing(false);
                                            }}
                                            disabled={saving}
                                            sx={{ background: "#D7F5FC", color: "#2BCDEF" }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={submitForm}
                                            disabled={saving || loading}
                                            sx={{ background: "#E8FADF", color: "#82E14F", marginBottom: 0 }}
                                        >
                                            Save
                                        </Button>
                                    </Stack>
                                )}
                            </Stack>

                            {loading && list.length === 0 ? (
                                <CircularProgress size={20} />
                            ) : editing ? (
                                <AutocompleteFormField
                                    name="skills"
                                    label="Skills"
                                    options={skillOptions}
                                    multiple
                                    freeSolo
                                />
                            ) : values.skills.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    No skills added yet.
                                </Typography>
                            ) : (
                                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                                    {values.skills.map((skill) => (
                                        <Chip
                                            key={skill}
                                            label={skill}
                                            size="small"
                                            sx={{ bgcolor: "#E8FADF", fontSize: "15px", color: "#82E14F", fontWeight: 500, padding: "16px 10px" }}
                                        />
                                    ))}
                                </Stack>
                            )}
                        </Stack>
                    </Form>
                )}
            </Formik>
        </Box>
    );
}