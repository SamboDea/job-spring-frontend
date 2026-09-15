"use client";

import React, { useEffect, useRef } from "react";
import { useSidebar } from "../SidebarContext/SidebarContext";
import { Search, X } from "lucide-react";
import { Tooltip } from "@mui/material";

export const SidebarSearch: React.FC = () => {
    const { isCollapsed, searchQuery, setSearchQuery, setIsCollapsed } = useSidebar();
    const inputRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcut handler (Ctrl+K or Cmd+K) to focus search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                if (isCollapsed) {
                    setIsCollapsed(false);
                }
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 100);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isCollapsed, setIsCollapsed]);

    if (isCollapsed) {
        return (
            <div className="px-3 py-2 flex justify-center">
                <Tooltip title="Search Menu (⌘K)" placement="right">
                    <button
                        onClick={() => {
                            setIsCollapsed(false);
                            setTimeout(() => inputRef.current?.focus(), 100);
                        }}
                        className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 flex items-center justify-center transition-colors"
                    >
                        <Search size={18} />
                    </button>
                </Tooltip>
            </div>
        );
    }

    return (
        <div className="px-4 py-3">
            <div className="relative flex items-center">
                <Search size={16} className="absolute left-3 text-zinc-400 pointer-events-none" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-zinc-100 dark:bg-zinc-800/60 border border-transparent focus:border-cyan-500/50 dark:focus:border-cyan-400/50 rounded-xl text-xs font-medium placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-800 dark:text-zinc-100 outline-none transition-all"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
        </div>
    );
};
