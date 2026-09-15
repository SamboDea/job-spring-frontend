"use client";

import React from "react";
import { Briefcase, FileText, CalendarCheck, Award, Clock, TrendingUp, TrendingDown } from "lucide-react";
import clsx from "clsx";

interface StatItem {
    id: string;
    title: string;
    value: string;
    change: string;
    isPositive: boolean;
    period: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    color: "cyan" | "emerald" | "amber" | "indigo" | "rose";
}

const statsData: StatItem[] = [
    {
        id: "active-jobs",
        title: "Active Job Openings",
        value: "48",
        change: "+12.5%",
        isPositive: true,
        period: "vs last month",
        icon: Briefcase,
        color: "cyan",
    },
    {
        id: "total-applications",
        title: "Total Applications",
        value: "1,429",
        change: "+24.8%",
        isPositive: true,
        period: "vs last month",
        icon: FileText,
        color: "emerald",
    },
    {
        id: "interviews-scheduled",
        title: "Interviews Scheduled",
        value: "86",
        change: "+8.2%",
        isPositive: true,
        period: "this week",
        icon: CalendarCheck,
        color: "amber",
    },
    {
        id: "offers-extended",
        title: "Offers Extended",
        value: "19",
        change: "+15.0%",
        isPositive: true,
        period: "vs last month",
        icon: Award,
        color: "indigo",
    },
    {
        id: "avg-time-to-hire",
        title: "Avg. Time-to-Hire",
        value: "18 Days",
        change: "-3.2 Days",
        isPositive: true,
        period: "faster than target",
        icon: Clock,
        color: "rose",
    },
];

export const StatCards: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {statsData.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={stat.id}
                        className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                {stat.title}
                            </span>
                            <div
                                className={clsx(
                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                                    stat.color === "cyan" && "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400",
                                    stat.color === "emerald" && "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400",
                                    stat.color === "amber" && "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400",
                                    stat.color === "indigo" && "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400",
                                    stat.color === "rose" && "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                                )}
                            >
                                <Icon size={20} />
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                                {stat.value}
                            </div>
                            <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                                <span
                                    className={clsx(
                                        "font-bold flex items-center gap-0.5 px-1.5 py-0.5 rounded-md",
                                        stat.isPositive
                                            ? "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400"
                                            : "bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400"
                                    )}
                                >
                                    {stat.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    {stat.change}
                                </span>
                                <span className="text-zinc-400 dark:text-zinc-500 font-medium">
                                    {stat.period}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
