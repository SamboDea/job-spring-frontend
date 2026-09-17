"use client";

import { Briefcase } from "lucide-react";
import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { DynamicCardSection } from "@/src/components/seeker/Card";
import { TextFormField, DateField, RichTextField, CheckBox, AutocompleteFormField } from "@/src/components/common/AppFormField";

interface EducationItem {
    institution: string;
    degree: string;
    startDate: string | null;
    endDate: string | null;
    isCurrent: boolean;
    description: string;
}

const initialEmptyEducation: EducationItem = {
    institution: "",
    degree: "",
    startDate: null,
    endDate: null,
    isCurrent: false,
    description: "",
};

const COUNTRY_OPTIONS = ["Cambodia", "Kampuchea"];

export function EducationSection() {
    const { values, setFieldValue } = useFormikContext<any>();

    return (
        <DynamicCardSection<EducationItem>
            name="education"
            title="Education"
            emptyTitle="No education added yet"
            emptySubtext="Add your education history."
            addButtonText="Add Education"
            initialEmptyItem={initialEmptyEducation}
            getItemTitle={(item) => item.institution || ""}
            getItemSubtitle={(item) => item.degree || ""}
            getItemStartDate={(item) => item.startDate}
            getItemEndDate={(item) => item.endDate}
            getItemIsCurrent={(item) => item.isCurrent}
            renderItem={(namePrefix, index, item) => {
                const isCurrent = values?.education?.[index]?.isCurrent;

                return (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 3,
                        }}
                    >
                        <TextFormField name={`${namePrefix}.institution`} label="Institution" />
                        <TextFormField name={`${namePrefix}.degree`} label="Degree" />

                        <DateField name={`${namePrefix}.startDate`} label="Start Date" />

                        {isCurrent ? (
                            <DateField name={`${namePrefix}.endDate`} label="End Date" disabled={true} />
                        ) : (
                            <DateField name={`${namePrefix}.endDate`} label="End Date" />
                        )}

                        <AutocompleteFormField name={`${namePrefix}.country`} label="Country" options={COUNTRY_OPTIONS} />

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
                                name={`${namePrefix}.description`}
                                label="Description"
                                placeholder="Describe your responsibilities and achievements..."
                            />
                        </Box>
                    </Box>
                );
            }}
        />
    );
}