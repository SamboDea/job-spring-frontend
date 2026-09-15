"use client";

import React from "react";
import { Search, RefreshCw, PlusCircle } from "lucide-react";
import clsx from "clsx";
import { TableHeaderToolbarProps } from "./types";
import Link from "next/link";

export function TableHeaderToolbar({
    title,
    count,
    subtitle,
    searchQuery,
    onSearchChange,
    searchPlaceholder = "Search…",
    filters,
    actions,
    isPending = false,
    className,
}: TableHeaderToolbarProps) {
    return (
        <div
            className={clsx(
                "flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5 border-b border-zinc-100 dark:border-zinc-800",
                className
            )}
        >
            <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    {title}
                    {count !== undefined && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-300">
                            {count}
                        </span>
                    )}
                </h3>
                {subtitle && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                {onSearchChange !== undefined && (
                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                        />
                        <input
                            type="text"
                            value={searchQuery ?? ""}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={searchPlaceholder}
                            className="pl-8 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 text-sm text-zinc-700 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition w-44"
                        />

                    </div>
                )}

                {filters}
                {actions}
                <Link
                    href="/jobs/post"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-90 transition shadow-sm self-start sm:self-auto"
                >
                    <PlusCircle size={16} />
                    Post a New Job
                </Link>
                {isPending && (
                    <RefreshCw size={15} className="text-cyan-500 animate-spin" />
                )}
            </div>
        </div>
    );
}
