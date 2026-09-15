"use client";

import React, { useState, useCallback } from "react";
import { JobPost } from "@/src/actions/jobPost";
import { Briefcase } from "lucide-react";
import clsx from "clsx";
import { MapPin, Clock, Users, ArrowUpRight } from "lucide-react";
import {
    statusBadge,
    employmentLabel,
    workModeLabel,
    formatDeadline,
    formatSalary,
} from "@/src/lib/jobUtils";
import JobDetailDrawer from "./JobDetailDrawer";

function JobCardClickable({
    job,
    companyName,
    companyLogoUrl,
    onClick,
    isActive,
}: {
    job: JobPost;
    companyName?: string;
    companyLogoUrl?: string;
    onClick: () => void;
    isActive: boolean;
}) {
    const displayName = companyName ?? "Employer";

    function initials(name: string) {
        return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
    }

    return (
        <button
            id={`job-card-${job.id}`}
            onClick={onClick}
            className={clsx(
                "group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900 text-left w-full",
                "border shadow-sm",
                "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                "overflow-hidden cursor-pointer",
                isActive
                    ? "border-cyan-400 dark:border-cyan-500 ring-2 ring-cyan-300/40 dark:ring-cyan-500/20 shadow-cyan-100 dark:shadow-none"
                    : "border-zinc-200/80 dark:border-zinc-800 hover:border-transparent"
            )}
        >
            {/* Gradient top edge */}
            <span
                aria-hidden
                className={clsx(
                    "absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(135deg,#07c4ec,#71dd37)] origin-left transition-transform duration-300",
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )}
            />

            <div className="flex items-start gap-3 p-5 pb-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[13px] font-bold text-zinc-600 dark:text-zinc-300 overflow-hidden">
                    {companyLogoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={companyLogoUrl} alt={displayName} className="h-full w-full object-cover" />
                    ) : (
                        initials(displayName)
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">{job.title}</h3>
                    <p className="truncate text-[13px] text-zinc-500 dark:text-zinc-400">{displayName}</p>
                    <div className="mt-1 flex items-center gap-1 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
                        <MapPin size={13} />
                        {job.location}
                    </div>
                </div>

                <ArrowUpRight
                    size={18}
                    className={clsx(
                        "mt-1 shrink-0 transition-all",
                        isActive
                            ? "text-cyan-500 translate-x-0.5 -translate-y-0.5"
                            : "text-zinc-300 dark:text-zinc-700 group-hover:text-cyan-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    )}
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
                        statusBadge[job.jobPostStatus] ?? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
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
        </button>
    );
}

// ─── Main export ──────────────────────────────────────────────────────────────

interface JobListWithDrawerProps {
    jobs: JobPost[];
    getCompany?: (job: JobPost) => { name?: string; logoUrl?: string };
    emptyMessage?: string;
}

export default function JobListWithDrawer({
    jobs,
    getCompany,
    emptyMessage = "No job posts found.",
}: JobListWithDrawerProps) {
    const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
    const [selectedCompanyName, setSelectedCompanyName] = useState<string | undefined>();
    const [selectedCompanyLogoUrl, setSelectedCompanyLogoUrl] = useState<string | undefined>();

    const handleOpen = useCallback((job: JobPost) => {
        const company = getCompany?.(job);
        setSelectedJob(job);
        setSelectedCompanyName(company?.name);
        setSelectedCompanyLogoUrl(company?.logoUrl);
    }, [getCompany]);

    const handleClose = useCallback(() => setSelectedJob(null), []);

    if (jobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-zinc-400 dark:text-zinc-500">
                <Briefcase size={28} strokeWidth={1.2} />
                <p className="text-sm">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {jobs.filter(Boolean).map((job) => {
                    const company = getCompany?.(job);
                    return (
                        <JobCardClickable
                            key={job.id}
                            job={job}
                            companyName={company?.name}
                            companyLogoUrl={company?.logoUrl}
                            isActive={selectedJob?.id === job.id}
                            onClick={() => handleOpen(job)}
                        />
                    );
                })}
            </div>

            <JobDetailDrawer
                job={selectedJob}
                companyName={selectedCompanyName}
                companyLogoUrl={selectedCompanyLogoUrl}
                onClose={handleClose}
            />
        </>
    );
}

