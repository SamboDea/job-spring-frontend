"use client";

import React from "react";
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Users } from "lucide-react";

export const RecruitmentCharts: React.FC = () => {
    // Pipeline data stages
    const pipelineData = [
        { stage: "Applied", count: 1429, percent: 100, color: "bg-cyan-500" },
        { stage: "Screened", count: 680, percent: 47.5, color: "bg-sky-500" },
        { stage: "Interview", count: 210, percent: 14.7, color: "bg-indigo-500" },
        { stage: "Offered", count: 32, percent: 2.2, color: "bg-emerald-500" },
        { stage: "Hired", count: 24, percent: 1.6, color: "bg-lime-500" },
    ];

    // Sourcing channel performance
    const channels = [
        { name: "LinkedIn Recruiter", count: 642, share: "45%", color: "bg-cyan-500" },
        { name: "Direct JobSpring Portal", count: 428, share: "30%", color: "bg-emerald-500" },
        { name: "Employee Referrals", count: 214, share: "15%", color: "bg-amber-500" },
        { name: "Indeed & External", count: 145, share: "10%", color: "bg-indigo-500" },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Hiring Pipeline Stage Breakdown */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                            <TrendingUp size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                                Recruitment Pipeline Breakdown
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Real-time candidate conversion across hiring stages
                            </p>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-lg">
                        1.6% Conversion Rate
                    </span>
                </div>

                <div className="mt-6 space-y-4">
                    {pipelineData.map((item) => (
                        <div key={item.stage} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-zinc-700 dark:text-zinc-300">{item.stage}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-900 dark:text-zinc-100 font-extrabold">{item.count.toLocaleString()}</span>
                                    <span className="text-zinc-400 dark:text-zinc-500 font-normal">({item.percent}%)</span>
                                </div>
                            </div>
                            <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                                <div
                                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                                    style={{ width: `${item.percent}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Candidate Sourcing Channels */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                            <PieChartIcon size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                                Sourcing Channels
                            </h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Candidate acquisition source
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    {channels.map((ch) => (
                        <div key={ch.name} className="p-3 rounded-xl bg-white dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <span className={`w-3 h-3 rounded-full ${ch.color}`} />
                                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{ch.name}</span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">{ch.count}</span>
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block">{ch.share}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
