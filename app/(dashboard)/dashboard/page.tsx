import React from "react";
import { StatCards } from "@/src/components/dashboard/Cards/StatCards";
import { RecruitmentCharts } from "@/src/components/dashboard/Charts/RecruitmentCharts";
import { RecentApplicationsTable } from "@/src/components/dashboard/Tables/RecentApplicationsTable";
import { Sparkles, Calendar, Plus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 text-white shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/20 via-emerald-500/10 to-transparent pointer-events-none" />

                <div className="space-y-1 relative z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-cyan-300 border border-white/10">
                        <Sparkles size={12} />
                        <span>JobSpring Recruitment Suite</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                        Welcome back, Sambo! 👋
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                        Here is your talent acquisition overview today. You have{" "}
                        <strong className="text-cyan-300 font-bold">12 new applications</strong> and{" "}
                        <strong className="text-emerald-300 font-bold">4 interviews</strong> scheduled for today.
                    </p>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <Link
                        href="/dashboard/interviews"
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all"
                    >
                        <Calendar size={16} />
                        <span>Today's Calendar</span>
                    </Link>

                    <Link
                        href="/dashboard/jobs/new"
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-lime-400 text-zinc-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
                    >
                        <Plus size={16} />
                        <span>Create Job Post</span>
                    </Link>
                </div>
            </div>

            <StatCards />
            <RecruitmentCharts />
            <RecentApplicationsTable />
        </>
    );
}