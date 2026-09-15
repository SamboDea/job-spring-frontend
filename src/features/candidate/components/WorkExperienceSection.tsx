"use client";

import { Briefcase } from "lucide-react";
import { Box } from "@mui/material";
import { useFormikContext } from "formik";
import { DynamicCardSection } from "@/src/components/seeker/Card";
import { TextFormField, DateField, RichTextField, CheckBox, AutocompleteFormField } from "@/src/components/common/AppFormField";

interface WorkExperienceItem {
    company: string;
    position: string;
    startDate: string | null;
    endDate: string | null;
    isCurrent: boolean;
    description: string;
}

const initialEmptyWorkExperience: WorkExperienceItem = {
    company: "",
    position: "",
    startDate: null,
    endDate: null,
    isCurrent: false,
    description: "",
};

const COUNTRY_OPTIONS = ["Cambodia", "Kampuchea"];

export function WorkExperienceSection() {
    const { values, setFieldValue } = useFormikContext<any>();

    return (
        <DynamicCardSection<WorkExperienceItem>
            name="workExperience"
            title="Work Experience"
            icon={<Briefcase className="w-5 h-5" />}
            emptyTitle="No work experience added yet"
            emptySubtext="Add your past roles and responsibilities."
            addButtonText="Add Work Experience"
            initialEmptyItem={initialEmptyWorkExperience}
            getItemTitle={(item) => item.company || "Company"}
            getItemSubtitle={(item) => item.position || ""}
            getItemStartDate={(item) => item.startDate}
            getItemEndDate={(item) => item.endDate}
            getItemIsCurrent={(item) => item.isCurrent}
            renderItem={(namePrefix, index, item) => {
                const isCurrent = values?.workExperience?.[index]?.isCurrent;

                return (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                            gap: 2,
                        }}
                    >
                        <TextFormField name={`${namePrefix}.company`} label="Company" />
                        <TextFormField name={`${namePrefix}.position`} label="Position" />

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