"use client";

import Link from "next/link";
import { MapPin, Briefcase, Clock, Users, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { JobPost } from "@/src/actions/jobPost";
import {
    statusBadge,
    employmentLabel,
    workModeLabel,
    formatDeadline,
    formatSalary,
} from "../../lib/jobUtils";

interface JobCardProps {
    job: JobPost;
    companyName?: string;
    companyLogoUrl?: string;
    href?: string;
    className?: string;
}

function initials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");
}

export default function JobCard({
    job,
    companyName,
    companyLogoUrl,
    href,
    className,
}: JobCardProps) {
    if (!job) return null;

    const displayName = companyName ?? "Employer";

    return (
        <Link
            href={href ?? `/jobs/${job.id}`}
            className={clsx(
                "group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900",
                "border border-zinc-200/80 dark:border-zinc-800 shadow-sm",
                "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                "hover:border-transparent overflow-hidden",
                className
            )}
        >
            <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(135deg,#07c4ec,#71dd37)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
            />

            <div className="flex items-start gap-3 p-5 pb-3">
                <div
                    className={clsx(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                        "bg-zinc-100 dark:bg-zinc-800 text-[13px] font-bold text-zinc-600 dark:text-zinc-300",
                        "overflow-hidden"
                    )}
                >
                    {companyLogoUrl ? (
                        <img
                            src={companyLogoUrl}
                            alt={displayName}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        initials(displayName)
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
                        {job.title}
                    </h3>
                    <p className="truncate text-[13px] text-zinc-500 dark:text-zinc-400">
                        {displayName}
                    </p>
                    <div className="mt-1 flex items-center gap-1 text-[12px] font-medium text-emerald-700 dark:text-emerald-300">
                        <MapPin size={13} />
                        {job.location}
                    </div>
                </div>

                <ArrowUpRight
                    size={18}
                    className="mt-1 shrink-0 text-zinc-300 dark:text-zinc-700 transition-all group-hover:text-cyan-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
            </div>

            <div className="flex flex-wrap gap-1.5 px-5 pb-3">
                <span className="rounded-full bg-cyan-50 dark:bg-cyan-950/40 px-2.5 py-1 text-[11px] font-medium text-cyan-700 dark:text-cyan-300">
                    {employmentLabel[job.employmentType] ?? job.employmentType}
                </span>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                    {workModeLabel[job.workMode] ?? job.workMode}
                </span>
                <span
                    className={clsx(
                        "rounded-full px-2.5 py-1 text-[11px] font-medium",
                        statusBadge[job.jobPostStatus] ?? "bg-zinc-100 text-zinc-500"
                    )}
                >
                    {job.jobPostStatus}
                </span>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 px-5 py-3">
                <span className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">
                    {formatSalary(job.minimumSalary, job.maximumSalary, job.currency)}
                </span>

                <div className="flex items-center gap-3 text-[12px] text-zinc-400 dark:text-zinc-500">
                    <span className="flex items-center gap-1">
                        <Users size={13} />
                        {job.numberOfPositions}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {formatDeadline(job.applicationDeadline)}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export function JobCardSkeleton() {
    return (
        <div className="flex flex-col rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 animate-pulse">
            <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800" />
                    <div className="h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800" />
                </div>
            </div>
            <div className="mt-4 flex gap-1.5">
                <div className="h-5 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                <div className="h-5 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800" />
            </div>
            <div className="mt-6 h-3 w-1/3 rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
    );
}

export function JobCardGrid({
    jobs,
    getCompany,
    emptyMessage = "No job posts found.",
}: {
    jobs: JobPost[];
    getCompany?: (job: JobPost) => { name?: string; logoUrl?: string };
    emptyMessage?: string;
}) {
    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-zinc-400">
                <Briefcase size={28} strokeWidth={1.2} />
                <p className="text-sm">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.filter(Boolean).map((job) => {
                const company = getCompany?.(job);
                return (
                    <JobCard
                        key={job.id}
                        job={job}
                        companyName={company?.name}
                        companyLogoUrl={company?.logoUrl}
                    />
                );
            })}
        </div>
    );
}