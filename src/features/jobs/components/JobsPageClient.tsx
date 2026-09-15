"use client";

import React, { useState, useMemo, useCallback } from "react";
import { JobPost } from "@/src/actions/jobPost";
import {
    Search,
    MapPin,
    SlidersHorizontal,
    Briefcase,
    X,
    ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import {
    employmentLabel,
    workModeLabel,
    formatDeadline,
    formatSalary,
    statusBadge,
    EMPLOYMENT_TYPES,
    WORK_MODES,
} from "@/src/lib/jobUtils";
import { MapPin as MapPinIcon, Clock, Users, ArrowUpRight } from "lucide-react";
import JobDetailDrawer from "@/src/features/jobs/components/JobDetailDrawer";

// ─── Clickable card ───────────────────────────────────────────────────────────

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
                "border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden cursor-pointer",
                isActive
                    ? "border-cyan-400 dark:border-cyan-500 ring-2 ring-cyan-300/40 dark:ring-cyan-500/20 shadow-cyan-100 dark:shadow-none"
                    : "border-zinc-200/80 dark:border-zinc-800 hover:border-transparent"
            )}
        >
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
                    ) : initials(displayName)}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">{job.title}</h3>
                    <p className="truncate text-[13px] text-zinc-500 dark:text-zinc-400">{displayName}</p>
                    <div className="mt-1 flex items-center gap-1 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
                        <MapPinIcon size={13} /> {job.location}
                    </div>
                </div>
                <ArrowUpRight
                    size={18}
                    className={clsx(
                        "mt-1 shrink-0 transition-all",
                        isActive ? "text-cyan-500 translate-x-0.5 -translate-y-0.5" : "text-zinc-300 dark:text-zinc-700 group-hover:text-cyan-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
                <span className={clsx("rounded-full px-2.5 py-1 text-[11px] font-medium", statusBadge[job.jobPostStatus] ?? "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400")}>
                    {job.jobPostStatus}
                </span>
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 px-5 py-3">
                <span className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200">
                    {formatSalary(job.minimumSalary, job.maximumSalary, job.currency)}
                </span>
                <div className="flex items-center gap-3 text-[12px] text-zinc-400 dark:text-zinc-500">
                    <span className="flex items-center gap-1"><Users size={13} />{job.numberOfPositions}</span>
                    <span className="flex items-center gap-1"><Clock size={13} />{formatDeadline(job.applicationDeadline)}</span>
                </div>
            </div>
        </button>
    );
}

// ─── Filter pill ──────────────────────────────────────────────────────────────

function FilterPill({
    label,
    active,
    onClick,
}: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200",
                active
                    ? "bg-cyan-500 border-cyan-500 text-white shadow-sm"
                    : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-cyan-400 dark:hover:border-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-400"
            )}
        >
            {label}
        </button>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export interface JobsPageClientProps {
    jobs: JobPost[];
    totalCount: number;
}

export default function JobsPageClient({ jobs }: JobsPageClientProps) {
    const [search, setSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [selectedEmployment, setSelectedEmployment] = useState<string[]>([]);
    const [selectedWorkMode, setSelectedWorkMode] = useState<string[]>([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);

    const handleOpen = useCallback((job: JobPost) => setSelectedJob(job), []);
    const handleClose = useCallback(() => setSelectedJob(null), []);

    const filtered = useMemo(() => {
        return jobs.filter((job) => {
            const q = search.toLowerCase();
            const matchesSearch =
                !q ||
                job.title.toLowerCase().includes(q) ||
                job.location.toLowerCase().includes(q) ||
                job.description?.toLowerCase().includes(q);

            const matchesLocation =
                !locationFilter ||
                job.location.toLowerCase().includes(locationFilter.toLowerCase());

            const matchesEmployment =
                selectedEmployment.length === 0 ||
                selectedEmployment.includes(job.employmentType);

            const matchesWorkMode =
                selectedWorkMode.length === 0 ||
                selectedWorkMode.includes(job.workMode);

            return matchesSearch && matchesLocation && matchesEmployment && matchesWorkMode;
        });
    }, [jobs, search, locationFilter, selectedEmployment, selectedWorkMode]);

    function toggleFilter(value: string, list: string[], setList: (v: string[]) => void) {
        setList(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
    }

    const hasFilters = selectedEmployment.length > 0 || selectedWorkMode.length > 0 || locationFilter;

    function clearFilters() {
        setSelectedEmployment([]);
        setSelectedWorkMode([]);
        setLocationFilter("");
    }

    return (
        <>
            <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 transition-colors duration-300">
                {/* ── Page header ───────────────────── */}
                <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                            <div className="flex-1">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                                    Job Listings
                                </h1>
                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                    {filtered.length} of {jobs.length} positions available
                                </p>
                            </div>

                            {/* Mobile filter toggle */}
                            <button
                                id="jobs-filter-toggle"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="sm:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:border-cyan-400 transition-colors"
                            >
                                <SlidersHorizontal size={15} />
                                Filters
                                {hasFilters && (
                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-cyan-500 text-white text-[9px] font-bold">
                                        {selectedEmployment.length + selectedWorkMode.length + (locationFilter ? 1 : 0)}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Search bar */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-3 max-w-3xl">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                                <input
                                    id="jobs-search"
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search job title or keyword…"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition"
                                />
                            </div>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                                <input
                                    id="jobs-location"
                                    type="text"
                                    value={locationFilter}
                                    onChange={(e) => setLocationFilter(e.target.value)}
                                    placeholder="Location…"
                                    className="w-full sm:w-48 pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 transition"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Body: sidebar + grid ──────────── */}
                <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">

                    {/* Sidebar filters */}
                    <aside
                        className={clsx(
                            "w-56 shrink-0 space-y-6",
                            "hidden sm:block"
                        )}
                    >
                        {/* Mobile overlay */}
                        {sidebarOpen && (
                            <div className="fixed inset-0 z-30 bg-black/40 sm:hidden" onClick={() => setSidebarOpen(false)} />
                        )}
                        <div
                            className={clsx(
                                "sm:static sm:block sm:shadow-none sm:bg-transparent sm:p-0",
                                "fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-900 rounded-t-2xl shadow-2xl p-5 border-t border-zinc-200 dark:border-zinc-800 transition-transform duration-300",
                                sidebarOpen ? "translate-y-0" : "translate-y-full",
                                "sm:translate-y-0"
                            )}
                        >
                            <div className="flex items-center justify-between mb-4 sm:mb-0">
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 sm:mb-3">Filters</p>
                                {hasFilters && (
                                    <button onClick={clearFilters} className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1">
                                        <X size={12} /> Clear all
                                    </button>
                                )}
                            </div>

                            {/* Employment type */}
                            <div className="mt-4">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Employment Type</p>
                                <div className="flex flex-wrap gap-2">
                                    {EMPLOYMENT_TYPES.map((t) => (
                                        <FilterPill
                                            key={t}
                                            label={employmentLabel[t] ?? t}
                                            active={selectedEmployment.includes(t)}
                                            onClick={() => toggleFilter(t, selectedEmployment, setSelectedEmployment)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Work mode */}
                            <div className="mt-5">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Work Mode</p>
                                <div className="flex flex-wrap gap-2">
                                    {WORK_MODES.map((m) => (
                                        <FilterPill
                                            key={m}
                                            label={workModeLabel[m] ?? m}
                                            active={selectedWorkMode.includes(m)}
                                            onClick={() => toggleFilter(m, selectedWorkMode, setSelectedWorkMode)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1 min-w-0">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-3 py-20 text-zinc-400 dark:text-zinc-500">
                                <Briefcase size={32} strokeWidth={1.2} />
                                <p className="text-sm font-medium">No jobs match your filters.</p>
                                {hasFilters && (
                                    <button onClick={clearFilters} className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                                {filtered.map((job) => (
                                    <JobCardClickable
                                        key={job.id}
                                        job={job}
                                        isActive={selectedJob?.id === job.id}
                                        onClick={() => handleOpen(job)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right-side detail drawer */}
            <JobDetailDrawer
                job={selectedJob}
                onClose={handleClose}
            />
        </>
    );
}

