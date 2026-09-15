"use client";

import React from "react";
import { Avatar, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import { MoreVertical, Eye, CheckCircle, Calendar, Sparkles, Filter } from "lucide-react";
import clsx from "clsx";

interface Candidate {
    id: string;
    name: string;
    email: string;
    avatar: string;
    appliedRole: string;
    department: string;
    status: "Shortlisted" | "Interview" | "Under Review" | "Offered" | "Rejected";
    matchScore: number;
    appliedDate: string;
}

const candidateData: Candidate[] = [
    {
        id: "cand-1",
        name: "Jessica Chen",
        email: "jessica.chen@example.com",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        appliedRole: "Senior Frontend Engineer (React/Next.js)",
        department: "Engineering",
        status: "Shortlisted",
        matchScore: 96,
        appliedDate: "2 hours ago",
    },
    {
        id: "cand-2",
        name: "Marcus Vance",
        email: "marcus.v@example.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        appliedRole: "Staff Backend Java Developer",
        department: "Engineering",
        status: "Interview",
        matchScore: 92,
        appliedDate: "5 hours ago",
    },
    {
        id: "cand-3",
        name: "Elena Rostova",
        email: "elena.r@example.com",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
        appliedRole: "Product Designer (UI/UX)",
        department: "Design",
        status: "Offered",
        matchScore: 98,
        appliedDate: "1 day ago",
    },
    {
        id: "cand-4",
        name: "David Kim",
        email: "david.kim@example.com",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
        appliedRole: "DevOps & Cloud Architect",
        department: "Infrastructure",
        status: "Under Review",
        matchScore: 84,
        appliedDate: "2 days ago",
    },
    {
        id: "cand-5",
        name: "Amanda Lewis",
        email: "amanda.l@example.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        appliedRole: "Technical Talent Sourcer",
        department: "Human Resources",
        status: "Rejected",
        matchScore: 68,
        appliedDate: "3 days ago",
    },
];

export const RecentApplicationsTable: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<{ [key: string]: HTMLElement | null }>({});

    const handleOpenMenu = (id: string, event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl((prev) => ({ ...prev, [id]: event.currentTarget }));
    };

    const handleCloseMenu = (id: string) => {
        setAnchorEl((prev) => ({ ...prev, [id]: null }));
    };

    return (
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-800">
                <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <span>Recent Candidate Applications</span>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-300 font-bold">
                            5 Active
                        </span>
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Latest applicants with AI match score ratings
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <Filter size={14} />
                        <span>Filter Status</span>
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
                    <thead className="text-[11px] uppercase tracking-wider font-extrabold text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-800/30 rounded-xl">
                        <tr>
                            <th className="px-4 py-3 rounded-l-xl">Candidate</th>
                            <th className="px-4 py-3">Role Applied</th>
                            <th className="px-4 py-3">AI Match</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Applied</th>
                            <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                        {candidateData.map((cand) => (
                            <tr key={cand.id} className="hover:bg-zinc-100/60 dark:hover:bg-zinc-800/30 transition-colors">
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <Avatar alt={cand.name} src={cand.avatar} sx={{ width: 36, height: 36 }} />
                                        <div>
                                            <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">{cand.name}</div>
                                            <div className="text-[11px] text-zinc-400 dark:text-zinc-500">{cand.email}</div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-4 py-3.5">
                                    <div className="font-semibold text-zinc-800 dark:text-zinc-200">{cand.appliedRole}</div>
                                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500">{cand.department}</div>
                                </td>

                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-1.5 font-extrabold text-cyan-600 dark:text-cyan-400">
                                        <Sparkles size={14} />
                                        <span>{cand.matchScore}%</span>
                                    </div>
                                </td>

                                <td className="px-4 py-3.5">
                                    <span
                                        className={clsx(
                                            "px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1",
                                            cand.status === "Shortlisted" && "bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300",
                                            cand.status === "Interview" && "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300",
                                            cand.status === "Offered" && "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
                                            cand.status === "Under Review" && "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
                                            cand.status === "Rejected" && "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300"
                                        )}
                                    >
                                        {cand.status}
                                    </span>
                                </td>

                                <td className="px-4 py-3.5 text-zinc-400 dark:text-zinc-500 font-medium">
                                    {cand.appliedDate}
                                </td>

                                <td className="px-4 py-3.5 text-right">
                                    <IconButton size="small" onClick={(e) => handleOpenMenu(cand.id, e)}>
                                        <MoreVertical size={16} className="text-zinc-400" />
                                    </IconButton>

                                    <Menu
                                        anchorEl={anchorEl[cand.id]}
                                        open={Boolean(anchorEl[cand.id])}
                                        onClose={() => handleCloseMenu(cand.id)}
                                        slotProps={{ paper: { className: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl min-w-[160px]" } }}
                                    >
                                        <MenuItem onClick={() => handleCloseMenu(cand.id)}>
                                            <ListItemIcon><Eye size={14} /></ListItemIcon>
                                            <ListItemText primary={<span className="text-xs font-semibold">View Resume</span>} />
                                        </MenuItem>
                                        <MenuItem onClick={() => handleCloseMenu(cand.id)}>
                                            <ListItemIcon><Calendar size={14} /></ListItemIcon>
                                            <ListItemText primary={<span className="text-xs font-semibold">Schedule Interview</span>} />
                                        </MenuItem>
                                        <MenuItem onClick={() => handleCloseMenu(cand.id)}>
                                            <ListItemIcon><CheckCircle size={14} className="text-emerald-500" /></ListItemIcon>
                                            <ListItemText primary={<span className="text-xs font-semibold text-emerald-600">Move to Offer</span>} />
                                        </MenuItem>
                                    </Menu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
