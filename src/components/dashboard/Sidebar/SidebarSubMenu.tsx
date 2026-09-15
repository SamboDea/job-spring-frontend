"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../SidebarContext/SidebarContext";
import { MenuItemType } from "./menu";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Tooltip, Collapse } from "@mui/material";
import clsx from "clsx";

interface SidebarSubMenuProps {
    item: MenuItemType;
}

export const SidebarSubMenu: React.FC<SidebarSubMenuProps> = ({ item }) => {
    const { isCollapsed, setIsCollapsed } = useSidebar();
    const pathname = usePathname();

    const isChildActive = item.children?.some((child) => pathname === child.href || pathname.startsWith(child.href + "/"));
    const [isOpen, setIsOpen] = useState<boolean>(Boolean(isChildActive));

    useEffect(() => {
        if (isChildActive) {
            setIsOpen(true);
        }
    }, [pathname, isChildActive]);

    const Icon = item.icon;

    const handleToggle = () => {
        if (isCollapsed) {
            setIsCollapsed(false);
            setIsOpen(true);
        } else {
            setIsOpen((prev) => !prev);
        }
    };

    const headerContent = (
        <button
            onClick={handleToggle}
            className={clsx(
                "w-full relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group text-left",
                isChildActive
                    ? "bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            )}
        >
            {isChildActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-500 shadow-sm" />
            )}

            <Icon
                className={clsx(
                    "w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                    isChildActive
                        ? "text-cyan-600 dark:text-cyan-400"
                        : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                )}
            />

            {!isCollapsed && (
                <span className="truncate flex-1 tracking-wide">{item.label}</span>
            )}

            {!isCollapsed && item.badge && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 shrink-0">
                    {item.badge.text}
                </span>
            )}

            {!isCollapsed && (
                <span className="text-zinc-400 dark:text-zinc-500 shrink-0 transition-transform duration-200">
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
            )}
        </button>
    );

    if (isCollapsed) {
        return (
            <Tooltip title={item.label} placement="right" arrow>
                <div className="my-0.5 flex justify-center">{headerContent}</div>
            </Tooltip>
        );
    }

    return (
        <div className="my-0.5 px-2">
            {headerContent}
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <div className="pl-6 pr-1 pt-1 pb-1 space-y-1 border-l-2 border-zinc-200 dark:border-zinc-800 ml-4 my-1">
                    {item.children?.map((child) => {
                        const isSubActive = pathname === child.href || pathname.startsWith(child.href + "/");
                        const SubIcon = child.icon;

                        return (
                            <Link
                                key={child.id}
                                href={child.href}
                                className={clsx(
                                    "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150",
                                    isSubActive
                                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/40"
                                )}
                            >
                                {SubIcon && <SubIcon className="w-4.5 h-4.5 shrink-0" />}
                                <span className="truncate flex-1">{child.label}</span>
                                {child.badge && (
                                    <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                                        {child.badge.text}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </Collapse>
        </div>
    );
};
