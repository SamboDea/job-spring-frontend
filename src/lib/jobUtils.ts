import * as Yup from "yup";
import { JobPost } from "@/src/actions/jobPost";
import { EditFormValues } from "@/src/types/job";

export type { EditFormValues };

// ─── Constants ────────────────────────────────────────────────────────────────

export const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];
export const WORK_MODES = ["ONSITE", "REMOTE", "HYBRID"];
export const CURRENCIES = ["USD", "KHR"];
export const STATUSES = ["DRAFT", "PUBLISHED", "CLOSED"];
export const STATUS_FILTERS = ["ALL", "DRAFT", "PUBLISHED", "CLOSED"];

// ─── Mappings & Badges ────────────────────────────────────────────────────────

export const statusBadge: Record<string, string> = {
    DRAFT: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    PUBLISHED: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
    CLOSED: "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400",
};

export const employmentLabel: Record<string, string> = {
    FULL_TIME: "Full-time",
    PART_TIME: "Part-time",
    CONTRACT: "Contract",
    INTERNSHIP: "Internship",
};

export const workModeLabel: Record<string, string> = {
    ONSITE: "On-site",
    REMOTE: "Remote",
    HYBRID: "Hybrid",
};

export function formatDeadline(iso: string): string {
    try {
        return new Date(iso).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return iso;
    }
}

export function formatSalary(min: number, max: number, currency: string): string {
    return `${currency} ${min.toLocaleString()} – ${max.toLocaleString()}`;
}

export function formatIsoDeadline(deadlineStr: string): string {
    if (!deadlineStr) {
        const defaultDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        return defaultDate.toISOString().slice(0, 19);
    }
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(deadlineStr)) {
        return deadlineStr.slice(0, 19);
    }
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(deadlineStr)) {
        return `${deadlineStr}:00`;
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(deadlineStr)) {
        return `${deadlineStr}T17:00:00`;
    }
    try {
        return new Date(deadlineStr).toISOString().slice(0, 19);
    } catch {
        return deadlineStr;
    }
}

export const editSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    responsibilities: Yup.string().required("Responsibilities are required"),
    requirements: Yup.string().required("Requirements are required"),
    benefits: Yup.string().required("Benefits are required"),
    location: Yup.string().required("Location is required"),
    employmentType: Yup.string().required("Employment type is required"),
    workMode: Yup.string().required("Work mode is required"),
    minimumSalary: Yup.number().typeError("Must be a number").min(0).required("Required"),
    maximumSalary: Yup.number()
        .typeError("Must be a number")
        .min(0)
        .required("Required")
        .test("max-gt-min", "Max ≥ Min", function (val) {
            return val == null || val >= (this.parent.minimumSalary || 0);
        }),
    currency: Yup.string().required("Required"),
    numberOfPositions: Yup.number().typeError("Must be a number").min(1).integer().required("Required"),
    jobPostStatus: Yup.string().required("Status is required"),
    applicationDeadline: Yup.string().required("Deadline is required"),
});

export function toEditValues(post: JobPost): EditFormValues {
    const deadline = post.applicationDeadline
        ? post.applicationDeadline.slice(0, 16)
        : "";
    return {
        title: post.title,
        description: post.description || "",
        responsibilities: post.responsibilities || "",
        requirements: post.requirements || "",
        benefits: post.benefits || "",
        location: post.location,
        employmentType: post.employmentType,
        workMode: post.workMode,
        minimumSalary: post.minimumSalary,
        maximumSalary: post.maximumSalary,
        currency: post.currency,
        numberOfPositions: post.numberOfPositions,
        jobPostStatus: post.jobPostStatus,
        applicationDeadline: deadline,
    };
}
