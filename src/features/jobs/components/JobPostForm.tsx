"use client";

import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState, useEffect, useRef } from "react";
import { TextFormField, SelectField, DateTimeField, RichTextField } from "@/src/components/common/AppFormField";
import { createJobPostAction, getNextJobCode, JobPostPayload } from "@/src/actions/jobPost";
import { formatIsoDeadline } from "@/src/lib/jobUtils";
import { useToast } from "@/src/components/common/Toast";

type FormValues = {
    jobCode: string;
    title: string;
    description: string;
    responsibilities: string;
    requirements: string;
    benefits: string;
    location: string;
    employmentType: string;
    workMode: string;
    minimumSalary: number | "";
    maximumSalary: number | "";
    currency: string;
    numberOfPositions: number | "";
    jobPostStatus: string;
    applicationDeadline: string;
};

const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];
const WORK_MODES = ["ONSITE", "REMOTE", "HYBRID"];
const CURRENCIES = ["USD", "KHR"];
const STATUSES = ["DRAFT", "PUBLISHED", "CLOSED"];

const validationSchema = Yup.object({
    jobCode: Yup.string().required("Job code is required"),
    title: Yup.string().required("Title is required"),
    description: Yup.string().test('not-empty', 'Description is required', (val) => {
        const text = val?.replace(/<[^>]*>/g, '').trim();
        return !!text;
    }),
    responsibilities: Yup.string().test('not-empty', 'Responsibilities are required', (val) => {
        const text = val?.replace(/<[^>]*>/g, '').trim();
        return !!text;
    }),
    requirements: Yup.string().test('not-empty', 'Requirements are required', (val) => {
        const text = val?.replace(/<[^>]*>/g, '').trim();
        return !!text;
    }),
    benefits: Yup.string().test('not-empty', 'Benefits are required', (val) => {
        const text = val?.replace(/<[^>]*>/g, '').trim();
        return !!text;
    }),
    location: Yup.string().required("Location is required"),
    employmentType: Yup.string().required("Employment type is required"),
    workMode: Yup.string().required("Work mode is required"),
    minimumSalary: Yup.number().typeError("Must be a number").min(0).required("Minimum salary is required"),
    maximumSalary: Yup.number()
        .typeError("Must be a number")
        .min(0)
        .required("Maximum salary is required")
        .test("max-gt-min", "Max salary must be ≥ min salary", function (val) {
            return val == null || val >= (this.parent.minimumSalary || 0);
        }),
    currency: Yup.string().required("Currency is required"),
    numberOfPositions: Yup.number()
        .typeError("Must be a number")
        .min(1)
        .integer()
        .required("Number of positions is required"),
    jobPostStatus: Yup.string().required("Status is required"),
    applicationDeadline: Yup.string().required("Deadline is required"),
});

const initialValues: FormValues = {
    jobCode: "",
    title: "",
    description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    location: "",
    employmentType: "",
    workMode: "",
    minimumSalary: "",
    maximumSalary: "",
    currency: "USD",
    numberOfPositions: "",
    jobPostStatus: "DRAFT",
    applicationDeadline: "",
};

export default function JobPostForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [codeLoading, setCodeLoading] = useState(true);
    const [nextCode, setNextCode] = useState("");
    const setFieldValueRef = useRef<((field: string, value: string) => void) | null>(null);
    const { showToast, ToastComponent } = useToast();

    async function fetchAndSetCode() {
        setCodeLoading(true);
        const code = await getNextJobCode();
        setNextCode(code);
        setFieldValueRef.current?.("jobCode", code);
        setCodeLoading(false);
    }

    useEffect(() => { fetchAndSetCode(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    async function handleSubmit(values: FormValues, helpers: FormikHelpers<FormValues>) {
        setServerError(null);
        setSuccessMsg(null);

        const deadline = formatIsoDeadline(values.applicationDeadline);

        const payload: JobPostPayload = {
            jobCode: values.jobCode,
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

        const result = await createJobPostAction(payload);

        if (!result.success) {
            const err = result.error ?? "Failed to create job post.";
            setServerError(err);
            showToast("error", err);
        } else {
            const msg = "Job post created successfully!";
            setSuccessMsg(msg);
            showToast("success", msg);
            helpers.resetForm();
            // Re-fetch the next code for the subsequent submission
            fetchAndSetCode();
        }

        helpers.setSubmitting(false);
    }

    async function handleDraft(values: FormValues, setSubmitting: (v: boolean) => void) {
        setServerError(null);
        setSuccessMsg(null);
        setSubmitting(true);

        const deadline = formatIsoDeadline(values.applicationDeadline);

        const payload: JobPostPayload = {
            jobCode: values.jobCode || `DRAFT-${Date.now()}`,
            title: values.title || "(Untitled)",
            description: values.description || "",
            responsibilities: values.responsibilities || "",
            requirements: values.requirements || "",
            benefits: values.benefits || "",
            location: values.location || "",
            employmentType: (values.employmentType as JobPostPayload["employmentType"]) || "FULL_TIME",
            workMode: (values.workMode as JobPostPayload["workMode"]) || "ONSITE",
            minimumSalary: Number(values.minimumSalary) || 0,
            maximumSalary: Number(values.maximumSalary) || 0,
            currency: (values.currency as JobPostPayload["currency"]) || "USD",
            numberOfPositions: Number(values.numberOfPositions) || 1,
            jobPostStatus: "DRAFT",
            applicationDeadline: deadline,
        };

        const result = await createJobPostAction(payload);

        if (!result.success) {
            const err = result.error ?? "Failed to save draft.";
            setServerError(err);
            showToast("error", err);
        } else {
            const msg = "Draft saved successfully!";
            setSuccessMsg(msg);
            showToast("success", msg);
        }

        setSubmitting(false);
    }

    return (
        <>
            <Formik
                initialValues={{ ...initialValues, jobCode: nextCode }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting, values, setSubmitting, setFieldValue }) => {
                    setFieldValueRef.current = setFieldValue;
                    return (
                        <Form className="space-y-8">
                            {serverError && (
                                <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                    {serverError}
                                </div>
                            )}
                            {successMsg && (
                                <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                                    {successMsg}
                                </div>
                            )}

                            <section>
                                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                                    Basic Information
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                    {/* <FormikTextField
                                        name="jobCode"
                                        label="Job Code"
                                        placeholder={codeLoading ? "Generating…" : "JOB-2026-0001"}
                                        disabled={codeLoading}
                                    /> */}
                                    <TextFormField name="title" label="Job Title" placeholder="e.g. Java Spring Boot Developer" />
                                    <TextFormField name="location" label="Location" placeholder="e.g. Phnom Penh" />
                                    <TextFormField
                                        name="numberOfPositions"
                                        label="Number of Positions"
                                        type="number"
                                        placeholder="1"
                                    />
                                </div>
                            </section>

                            <section>
                                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                                    Classification
                                </h2>
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
                                        name="jobPostStatus"
                                        label="Status"
                                        options={STATUSES}
                                    />
                                </div>
                            </section>

                            <section>
                                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                                    Salary
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-6">
                                    <TextFormField
                                        name="minimumSalary"
                                        label="Minimum Salary"
                                        type="number"
                                        placeholder="800"
                                    />
                                    <TextFormField
                                        name="maximumSalary"
                                        label="Maximum Salary"
                                        type="number"
                                        placeholder="1500"
                                    />
                                    <SelectField name="currency" label="Currency" options={CURRENCIES} />
                                </div>
                            </section>

                            <section>
                                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                                    Job Description
                                </h2>
                                <RichTextField
                                    name="description"
                                    label=""
                                    placeholder="Describe the role and what the candidate will be working on..."
                                />
                            </section>

                            <section>
                                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                                    Responsibilities
                                </h2>
                                <RichTextField
                                    name="responsibilities"
                                    label=""
                                    placeholder="e.g. Develop REST APIs and maintain backend services..."
                                />
                            </section>

                            <section>
                                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                                    Requirements
                                </h2>
                                <RichTextField
                                    name="requirements"
                                    label=""
                                    placeholder="e.g. Experience with Java, Spring Boot and PostgreSQL..."
                                />
                            </section>

                            <section>
                                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                                    Benefits
                                </h2>
                                <RichTextField
                                    name="benefits"
                                    label=""
                                    placeholder="e.g. Annual bonus, insurance and training..."
                                    minHeight={80}
                                />
                            </section>

                            <section>
                                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                                    Application Deadline
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                    <DateTimeField
                                        name="applicationDeadline"
                                        label="Deadline"
                                    />
                                </div>
                            </section>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => handleDraft(values, setSubmitting)}
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition disabled:opacity-50"
                                >
                                    Save as Draft
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 transition shadow-sm disabled:opacity-50"
                                >
                                    {isSubmitting ? "Posting…" : "Post Job"}
                                </button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
}
