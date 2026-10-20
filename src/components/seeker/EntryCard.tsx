"use client";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Box } from "@mui/material";
import { Card } from "./Card";
import { EntryFieldConfig } from "@/src/types/dynamic-entry";
import { renderField } from "@/src/components/seeker/renderField";
import { SubmitButton } from "@/src/features/candidate/components/SubmitButton";

interface EntryCardProps {
    id: number | "new";
    values: Record<string, any>;
    fields: EntryFieldConfig[];
    validationSchema: Yup.ObjectSchema<any>;
    title: string;
    subtitle?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    expanded: boolean;
    onToggle: () => void;
    onSave: (values: Record<string, any>) => Promise<void>;
    onCancelNew?: () => void; // only for id === "new"
    onDelete?: () => void; // only for existing entries
    saving: boolean;
    removing: boolean;
}

export function EntryCard({
    id,
    values,
    fields,
    validationSchema,
    title,
    subtitle,
    startDate,
    endDate,
    isCurrent,
    expanded,
    onToggle,
    onSave,
    onCancelNew,
    onDelete,
    saving,
    removing,
}: EntryCardProps) {
    return (
        <Formik
            initialValues={values}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={async (vals, { setSubmitting }) => {
                try {
                    await onSave(vals);
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ values: liveValues, isSubmitting }) => (
                <Form>
                    <Card
                        title={title}
                        subtitle={subtitle}
                        startDate={startDate}
                        endDate={endDate}
                        isCurrent={isCurrent}
                        canRemove={id !== "new"}
                        onRemove={onDelete}
                        expanded={expanded}
                        onToggle={onToggle}
                        removing={removing}
                    >
                        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {fields.map((field) => renderField(field, liveValues))}
                        </Box>

                        <Box className="flex justify-end gap-2 mt-5">
                            {id === "new" && onCancelNew && (
                                <Button type="button" onClick={onCancelNew} disabled={isSubmitting || saving}>
                                    Cancel
                                </Button>
                            )}
                            <SubmitButton />
                        </Box>
                    </Card>
                </Form>
            )
            }
        </Formik >
    );
}