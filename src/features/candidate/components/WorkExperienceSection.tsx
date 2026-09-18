"use client";

import React from "react";
import { Formik, Form } from "formik";
import { Box } from "@mui/material";
import { DynamicCardSection } from "@/src/components/seeker/Card";
import {
    TextFormField,
    DateField,
    RichTextField,
    CheckBox,
    AutocompleteFormField,
} from "@/src/components/common/AppFormField";
import { SubmitButton } from "./SubmitButton";
import { workExperienceValidationSchema } from "@/src/features/candidate/work-experience/validation";
import {
    WorkExperienceItem,
    WorkExperienceFormValues,
    initialEmptyWorkExperience,
} from "@/src/features/candidate/work-experience/types";
import { useWorkExperienceForm } from "@/src/features/candidate/work-experience/useWorkExperienceForm";
import { deleteWorkExperience } from "@/src/features/candidate/work-experience/action";

const COUNTRY_OPTIONS = ["Cambodia", "Kampuchea", "United States", "Singapore"];
const CITY_OPTIONS = ["Phnom Penh", "Siem Reap", "Sihanoukville", "Banteay Meanchey"];

export function WorkExperienceSection() {
    const { initialData, loading, submit } = useWorkExperienceForm();

    const initialValues: WorkExperienceFormValues = {
        workExperience: initialData.length > 0 ? initialData : [],
    };

    const handleSubmit = async (
        values: WorkExperienceFormValues,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        try {
            await submit(values);
        } catch (error) {
            console.error("Failed to submit work experience:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="h-32 animate-pulse bg-gray-50 rounded-xl" />;
    }

    return (
        <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={workExperienceValidationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, setFieldValue }) => (
                <Form>
                    <DynamicCardSection<WorkExperienceItem>
                        name="workExperience"
                        title="Work Experience"
                        emptyTitle="No work experience added yet"
                        emptySubtext="Add your past roles and responsibilities."
                        addButtonText="Add Work Experience"
                        initialEmptyItem={initialEmptyWorkExperience}
                        getItemTitle={(item) => item.companyName || ""}
                        getItemSubtitle={(item) => item.jobTitle || ""}
                        getItemStartDate={(item) => item.startDate}
                        getItemEndDate={(item) => item.endDate}
                        getItemIsCurrent={(item) => item.isCurrent}
                        onRemoveItem={async (item) => {
                            if (!item.workExperienceId) {
                                return true; // unsaved card — just remove locally
                            }
                            try {
                                await deleteWorkExperience(item.workExperienceId);
                                return true;
                            } catch (err) {
                                console.error("Failed to delete work experience:", err);
                                return false;
                            }
                        }}
                        renderItem={(namePrefix, index) => {
                            const isCurrent = values?.workExperience?.[index]?.isCurrent;

                            return (
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                        gap: 3,
                                    }}
                                >
                                    <TextFormField name={`${namePrefix}.companyName`} label="Company" placeholder="e.g. Google" />
                                    <TextFormField name={`${namePrefix}.jobTitle`} label="Position" placeholder="e.g. Senior Software Engineer" />

                                    <DateField name={`${namePrefix}.startDate`} label="Start Date" />

                                    {isCurrent ? (
                                        <DateField name={`${namePrefix}.endDate`} label="End Date" disabled={true} />
                                    ) : (
                                        <DateField name={`${namePrefix}.endDate`} label="End Date" />
                                    )}

                                    <AutocompleteFormField
                                        name={`${namePrefix}.country`}
                                        label="Country"
                                        options={COUNTRY_OPTIONS}
                                        multiple={false}
                                    />
                                    <AutocompleteFormField
                                        name={`${namePrefix}.city`}
                                        label="City"
                                        options={CITY_OPTIONS}
                                        multiple={false}
                                    />

                                    <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
                                        <CheckBox
                                            name={`${namePrefix}.isCurrent`}
                                            label="I am currently working in this role"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                setFieldValue(`${namePrefix}.isCurrent`, e.target.checked);
                                                if (e.target.checked) {
                                                    setFieldValue(`${namePrefix}.endDate`, null);
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
                                        <RichTextField
                                            label="jobResponsibility"
                                            name={`${namePrefix}.jobResponsibility`}
                                            placeholder="Describe your responsibilities and achievements..."
                                        />
                                    </Box>
                                </Box>
                            );
                        }}
                    />

                    {values.workExperience && values.workExperience.length > 0 && (
                        <div className="mt-4 flex justify-end">
                            <SubmitButton />
                        </div>
                    )}
                </Form>
            )}
        </Formik>
    );
}