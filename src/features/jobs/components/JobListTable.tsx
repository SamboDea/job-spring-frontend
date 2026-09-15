"use client";

import React, { useState, useTransition, useCallback, useMemo } from "react";
import {
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";
import {
    MoreVertical,
    Pencil,
    Trash2,
    MapPin,
    Briefcase,
    ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import { JobPost, JobPostPayload, deleteJobPostAction } from "@/src/actions/jobPost";
import { DataTable, TableHeaderToolbar, TableColumn } from "@/src/components/common/table";
import {
    STATUS_FILTERS,
    statusBadge,
    employmentLabel,
    workModeLabel,
    formatDeadline,
    formatSalary,
} from "@/src/lib/jobUtils";
import JobEditDialog from "./JobEditDialog";
import JobDeleteDialog from "./JobDeleteDialog";

interface JobListTableProps {
    initialPosts: JobPost[];
}

export default function JobListTable({ initialPosts }: JobListTableProps) {
    const [posts, setPosts] = useState<JobPost[]>(initialPosts);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [anchorEl, setAnchorEl] = useState<{ [id: string]: HTMLElement | null }>({});
    const [editPost, setEditPost] = useState<JobPost | null>(null);
    const [deletePost, setDeletePost] = useState<JobPost | null>(null);
    const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    const showToast = useCallback((type: "success" | "error", msg: string) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    }, []);

    const openMenu = (id: string, e: React.MouseEvent<HTMLElement>) =>
        setAnchorEl((p) => ({ ...p, [id]: e.currentTarget }));
    const closeMenu = (id: string) => setAnchorEl((p) => ({ ...p, [id]: null }));

    const filtered = useMemo(() => {
        return posts.filter((p) => {
            const matchStatus = statusFilter === "ALL" || p.jobPostStatus === statusFilter;
            const q = search.toLowerCase();
            const matchSearch =
                !q ||
                p.title.toLowerCase().includes(q) ||
                p.jobCode.toLowerCase().includes(q) ||
                p.location.toLowerCase().includes(q);
            return matchStatus && matchSearch;
        });
    }, [posts, statusFilter, search]);

    function handleDeleteConfirm() {
        if (!deletePost) return;
        const id = deletePost.id;
        setDeletePost(null);
        startTransition(async () => {
            const res = await deleteJobPostAction(id);
            if (res.success) {
                setPosts((prev) => prev.filter((p) => p.id !== id));
                showToast("success", "Job post deleted successfully.");
            } else {
                showToast("error", res.error ?? "Failed to delete.");
            }
        });
    }

    function handleJobUpdated(updatedId: string, payload: Partial<JobPostPayload>) {
        setPosts((prev) =>
            prev.map((p) => (p.id === updatedId ? { ...p, ...payload } : p))
        );
        showToast("success", "Job post updated successfully.");
    }

    const columns: TableColumn<JobPost>[] = useMemo(
        () => [
            {
                key: "title",
                header: "Title & Location",
                className: "max-w-[220px]",
                render: (post) => (
                    <div>
                        <div className="text-zinc-900 text-[14px] dark:text-zinc-100 truncate font-medium">
                            {post.title}
                        </div>
                        <div className="flex items-center gap-1 text-[12px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                            <MapPin size={16} />
                            {post.location}
                        </div>
                    </div>
                ),
            },
            {
                key: "employmentType",
                header: "Type",
                className: "whitespace-nowrap text-[14px] font-medium text-zinc-700 dark:text-zinc-300",
                render: (post) => employmentLabel[post.employmentType] ?? post.employmentType,
            },
            {
                key: "workMode",
                header: "Mode",
                className: "whitespace-nowrap text-[14px] font-medium text-zinc-700 dark:text-zinc-300",
                render: (post) => workModeLabel[post.workMode] ?? post.workMode,
            },
            {
                key: "salary",
                header: "Salary",
                className: "whitespace-nowrap text-[14px] font-medium text-zinc-700 dark:text-zinc-300",
                render: (post) => formatSalary(post.minimumSalary, post.maximumSalary, post.currency),
            },
            {
                key: "positions",
                header: "Position",
                align: "center",
                className: "font-bold text-[14px] text-zinc-800 dark:text-zinc-200",
                render: (post) => post.numberOfPositions,
            },
            {
                key: "deadline",
                header: "Deadline",
                className: "whitespace-nowrap text-[14px] font-medium text-zinc-700 dark:text-zinc-300",
                render: (post) => formatDeadline(post.applicationDeadline),
            },
            {
                key: "status",
                header: "Status",
                render: (post) => (
                    <span
                        className={clsx(
                            "px-2.5 py-2 rounded-full text-[14px] font-medium",
                            statusBadge[post.jobPostStatus] ?? "bg-zinc-100 text-zinc-500"
                        )}
                    >
                        {post.jobPostStatus}
                    </span>
                ),
            },
            {
                key: "actions",
                header: "Actions",
                align: "right",
                render: (post) => (
                    <>
                        <Tooltip title="Actions" placement="left" arrow>
                            <IconButton size="small" onClick={(e) => openMenu(post.id, e)}>
                                <MoreVertical size={17} className="text-emerald-700 dark:text-emerald-300" />
                            </IconButton>
                        </Tooltip>

                        <Menu
                            anchorEl={anchorEl[post.id]}
                            open={Boolean(anchorEl[post.id])}
                            onClose={() => closeMenu(post.id)}
                            slotProps={{
                                paper: {
                                    className:
                                        "bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 shadow-xl rounded-xl min-w-[150px]",
                                },
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    closeMenu(post.id);
                                    setEditPost(post);
                                }}
                            >
                                <ListItemIcon>
                                    <Pencil size={14} className="text-cyan-500" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<span className="text-xs font-semibold">Edit</span>}
                                />
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    closeMenu(post.id);
                                    setDeletePost(post);
                                }}
                            >
                                <ListItemIcon>
                                    <Trash2 size={14} className="text-rose-500" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <span className="text-xs font-semibold text-rose-500">
                                            Delete
                                        </span>
                                    }
                                />
                            </MenuItem>
                        </Menu>
                    </>
                ),
            },
        ],
        [anchorEl]
    );

    return (
        <div className="relative">
            {toast && (
                <div
                    className={clsx(
                        "fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold transition-all",
                        toast.type === "success"
                            ? "bg-emerald-500 text-white"
                            : "bg-rose-500 text-white"
                    )}
                >
                    {toast.msg}
                </div>
            )}

            <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden">
                <TableHeaderToolbar
                    title="Job Postings"
                    count={filtered.length}
                    subtitle="Manage, edit and remove your published job listings."
                    searchQuery={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search jobs…"
                    isPending={isPending}
                    filters={
                        <div className="relative inline-flex items-center">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="appearance-none pl-3 pr-7 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 cursor-pointer transition"
                            >
                                {STATUS_FILTERS.map((s) => (
                                    <option key={s} value={s}>
                                        {s === "ALL" ? "All Status" : s}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={12} className="absolute right-2 text-zinc-400 pointer-events-none" />
                        </div>
                    }
                />

                <DataTable
                    data={filtered}
                    columns={columns}
                    keyExtractor={(post) => post.id}
                    emptyMessage="No job posts found."
                    emptyIcon={<Briefcase size={32} strokeWidth={1.2} />}
                    totalCount={posts.length}
                    footerLeft={
                        <span>
                            Showing {filtered.length} of {posts.length} posts
                        </span>
                    }
                />
            </div>

            <JobEditDialog
                job={editPost}
                onClose={() => setEditPost(null)}
                onUpdated={handleJobUpdated}
                onError={(msg) => showToast("error", msg)}
            />

            <JobDeleteDialog
                job={deletePost}
                onClose={() => setDeletePost(null)}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
