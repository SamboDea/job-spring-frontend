"use client";

import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from "@mui/material";
import { Formik, Form, FormikHelpers } from "formik";
import { X, RefreshCw } from "lucide-react";
import {
    TextFormField,
    SelectField,
    DateTimeField,
    RichTextField,
} from "@/src/components/common/AppFormField";
import {
    JobPost,
    JobPostPayload,
    updateJobPostAction,
} from "@/src/actions/jobPost";
import {
    EMPLOYMENT_TYPES,
    WORK_MODES,
    CURRENCIES,
    STATUSES,
    editSchema,
    toEditValues,
    EditFormValues,
    formatIsoDeadline,
} from "@/src/lib/jobUtils";

interface JobEditDialogProps {
    job: JobPost | null;
    onClose: () => void;
    onUpdated: (updatedPostId: string, updatedPayload: Partial<JobPostPayload>) => void;
    onError: (msg: string) => void;
}

export default function JobEditDialog({
    job,
    onClose,
    onUpdated,
    onError,
}: JobEditDialogProps) {
    const [dialogError, setDialogError] = useState<string | null>(null);

    if (!job) return null;

    function handleClose() {
        setDialogError(null);
        onClose();
    }

    async function handleEditSubmit(
        values: EditFormValues,
        helpers: FormikHelpers<EditFormValues>
    ) {
        if (!job) return;
        setDialogError(null);

        const deadline = formatIsoDeadline(values.applicationDeadline);

        const payload: JobPostPayload = {
            jobCode: job.jobCode,
            title: values.title,
            description: values.description,
            responsibilities: values.responsibilities,
            requirements: values.requirements,
            benefits: values.benefits,
            location: values.location,
            employmentType: values.employmentType as JobPostPayload["employmentType"],
            workMode: values.workMode as JobPostPayload["workMode"],
            minimumSalary: Number(values.minimumSalary),
            maximumSalary: Number(values.maximumSalary),
            currency: values.currency as JobPostPayload["currency"],
            numberOfPositions: Number(values.numberOfPositions),
            jobPostStatus: values.jobPostStatus as JobPostPayload["jobPostStatus"],
            applicationDeadline: deadline,
        };

        const res = await updateJobPostAction(job.id, payload);

        if (res.success) {
            onUpdated(job.id, payload);
            handleClose();
        } else {
            const err = res.error ?? "Failed to update job post.";
            setDialogError(err);
            onError(err);
        }

        helpers.setSubmitting(false);
    }

    return (
        <Dialog
            open={!!job}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    className:
                        "border border-zinc-200 dark:border-zinc-800 rounded-2xl",
                },
            }}
        >
            <DialogTitle className="bg-white dark:bg-zinc-950 flex border border-zinc-200 dark:border-zinc-800 items-center justify-between px-6 pt-6 pb-2">
                <div>
                    <p className="text-xl font-semibold text-cyan-500 dark:text-cyan-500">
                        Edit Job Post
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-mono">
                        {job.jobCode}
                    </p>
                </div>
                <IconButton size="small" onClick={handleClose}>
                    <X size={24} className="text-zinc-400" />
                </IconButton>
            </DialogTitle>

            <DialogContent
                dividers
                className="border-zinc-100 dark:border-zinc-800 px-6 py-5 bg-white dark:bg-zinc-950"
            >
                {dialogError && (
                    <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {dialogError}
                    </div>
                )}

                <Formik
                    key={job.id}
                    initialValues={toEditValues(job)}
                    validationSchema={editSchema}
                    onSubmit={handleEditSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form id="edit-job-form" className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                <TextFormField name="title" label="Job Title" />
                                <TextFormField name="location" label="Location" />
                                <TextFormField
                                    name="numberOfPositions"
                                    label="Positions"
                                    type="number"
                                />
                                <SelectField
                                    name="jobPostStatus"
                                    label="Status"
                                    options={STATUSES}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-6">
                                <SelectField
                                    name="employmentType"
                                    label="Employment Type"
                                    options={EMPLOYMENT_TYPES}
                                />
                                <SelectField
                                    name="workMode"
                                    label="Work Mode"
                                    options={WORK_MODES}
                                />
                                <SelectField
                                    name="currency"
                                    label="Currency"
                                    options={CURRENCIES}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                <TextFormField
                                    name="minimumSalary"
                                    label="Min Salary"
                                    type="number"
                                />
                                <TextFormField
                                    name="maximumSalary"
                                    label="Max Salary"
                                    type="number"
                                />
                            </div>
                            <div className="mt-3"></div>
                            <DateTimeField
                                name="applicationDeadline"
                                label="Application Deadline"
                            />
                            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                                Job Description
                            </h2>
                            <RichTextField
                                name="description"
                                label=""
                                placeholder="Describe the role and what the candidate will be working on..."
                            />
                            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                                Responsibilities
                            </h2>
                            <RichTextField
                                name="responsibilities"
                                label=""
                                placeholder="What will the candidate be responsible for?"
                            />
                            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                                Requirements
                            </h2>
                            <RichTextField
                                name="requirements"
                                label=""
                                placeholder="What skills and experience are required for this role?"
                            />
                            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                                Benefits
                            </h2>
                            <RichTextField
                                name="benefits"
                                label=""
                                placeholder="What benefits are offered for this role?"
                            />
                            <div className="mt-3"></div>
                            {isSubmitting && (
                                <div className="text-xs text-cyan-500 flex items-center gap-2">
                                    <RefreshCw size={13} className="animate-spin" /> Saving
                                    changes…
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>
            </DialogContent>

            <DialogActions className="px-6 py-4 gap-2 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
                <button
                    type="button"
                    onClick={handleClose}
                    className="cursor-pointer px-4 py-2 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    form="edit-job-form"
                    className="cursor-pointer px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 text-white font-semibold text-sm shadow-sm transition"
                >
                    Save Changes
                </button>
            </DialogActions>
        </Dialog>
    );
}
