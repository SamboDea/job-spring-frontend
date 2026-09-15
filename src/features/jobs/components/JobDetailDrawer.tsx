"use client";

import React, { useEffect } from "react";
import {
    X,
    MapPin,
    Briefcase,
    Clock,
    Users,
    DollarSign,
    Monitor,
    CalendarDays,
    CheckCircle2,
    Hash,
} from "lucide-react";
import clsx from "clsx";
import { JobPost } from "@/src/actions/jobPost";
import {
    employmentLabel,
    workModeLabel,
    formatDeadline,
    formatSalary,
    statusBadge,
} from "../../../lib/jobUtils";
import { htmlToStructuredText } from "@/src/lib/utils";

interface JobDetailDrawerProps {
    job: JobPost | null;
    companyName?: string;
    companyLogoUrl?: string;
    onClose: () => void;
}

function initials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
                {title}
            </h3>
            <div className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {children}
            </div>
        </div>
    );
}

function InfoChip({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800/80">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                <Icon size={14} />
            </div>
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{label}</p>
                <p className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">{value}</p>
            </div>
        </div>
    );
}

export default function JobDetailDrawer({
    job,
    companyName,
    companyLogoUrl,
    onClose,
}: JobDetailDrawerProps) {
    const isOpen = !!job;
    const displayName = companyName ?? "Employer";

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <>
            <div
                onClick={onClose}
                className={clsx(
                    "fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-label={job?.title ?? "Job detail"}
                className={clsx(
                    "fixed top-0 right-0 z-50 h-full w-full max-w-[520px]",
                    "bg-white dark:bg-zinc-900 shadow-2xl flex flex-col border-l border-zinc-200 dark:border-zinc-800",
                    "transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {job && (
                    <>
                        <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(135deg,#07c4ec,#71dd37)]" />
                        <div className="flex items-start gap-4 px-6 pt-7 pb-5 border-b border-zinc-100 dark:border-zinc-800">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-base font-bold text-zinc-600 dark:text-zinc-300 overflow-hidden shadow-sm">
                                {companyLogoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={companyLogoUrl} alt={displayName} className="h-full w-full object-cover" />
                                ) : (
                                    initials(displayName)
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug">{job.title}</h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{displayName}</p>
                                <div className="flex items-center gap-1 mt-1 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
                                    <MapPin size={12} />
                                    {job.location}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                                <button
                                    id="job-drawer-close"
                                    onClick={onClose}
                                    className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                    aria-label="Close drawer"
                                >
                                    <X size={18} />
                                </button>
                                <span
                                    className={clsx(
                                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                        statusBadge[job.jobPostStatus] ?? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                                    )}
                                >
                                    {job.jobPostStatus}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                            <div className="grid grid-cols-2 gap-2.5">
                                <InfoChip
                                    icon={DollarSign}
                                    label="Salary"
                                    value={formatSalary(job.minimumSalary, job.maximumSalary, job.currency)}
                                />
                                <InfoChip
                                    icon={Briefcase}
                                    label="Employment"
                                    value={employmentLabel[job.employmentType] ?? job.employmentType}
                                />
                                <InfoChip
                                    icon={Monitor}
                                    label="Work Mode"
                                    value={workModeLabel[job.workMode] ?? job.workMode}
                                />
                                <InfoChip
                                    icon={Users}
                                    label="Positions"
                                    value={`${job.numberOfPositions} opening${job.numberOfPositions !== 1 ? "s" : ""}`}
                                />
                                <InfoChip
                                    icon={CalendarDays}
                                    label="Deadline"
                                    value={formatDeadline(job.applicationDeadline)}
                                />
                                <InfoChip
                                    icon={Hash}
                                    label="Job Code"
                                    value={job.jobCode}
                                />
                            </div>

                            <div className="border-t border-zinc-100 dark:border-zinc-800" />

                            {job.description && (
                                <Section title="About this role">
                                    {htmlToStructuredText(job.description)}
                                </Section>
                            )}

                            {job.responsibilities && (
                                <Section title="Responsibilities">
                                    {htmlToStructuredText(job.responsibilities)}
                                </Section>
                            )}
                            {job.requirements && (
                                <Section title="Requirements">
                                    {htmlToStructuredText(job.requirements)}
                                </Section>
                            )}

                            {job.benefits && (
                                <Section title="Benefits">
                                    {htmlToStructuredText(job.benefits)}
                                </Section>
                            )}

                            <div className="h-4" />
                        </div>

                        <div className="shrink-0 px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-3">
                            <button
                                id="job-drawer-apply"
                                className="flex-1 py-3 rounded-xl bg-[linear-gradient(135deg,#07c4ec,#71dd37)] text-white font-bold text-sm shadow-md hover:shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={16} />
                                Apply Now
                            </button>
                            <button
                                onClick={onClose}
                                className="px-5 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

