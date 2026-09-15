"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../SidebarContext/SidebarContext";
import { MenuItemType } from "./menu";
import { Tooltip } from "@mui/material";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

interface SidebarMenuItemProps {
    item: MenuItemType;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ item }) => {
    const { isCollapsed } = useSidebar();
    const pathname = usePathname();

    const Icon = item.icon;
    const hasChildren = !!item.children?.length;

    // Exact match only — prevents sibling routes like /jobs and /jobs/post
    // from both lighting up when one is a text-prefix of the other.
    const isRouteActive = (href?: string) => {
        if (!href) return false;
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname === href;
    };

    const isActive = isRouteActive(item.href);

    const isChildActive = hasChildren
        ? item.children!.some((child) => isRouteActive(child.href))
        : false;

    // Submenu open state. Auto-open when a child route becomes active,
    // but let the user manually close it afterwards (toggled on click).
    const [open, setOpen] = useState(isChildActive);

    useEffect(() => {
        if (isChildActive) setOpen(true);
    }, [isChildActive, pathname]);

    const handleParentClick = () => {
        if (hasChildren) setOpen((prev) => !prev);
    };

    const linkOrToggleClasses = clsx(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group w-full",
        (isActive || isChildActive)
            ? "bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-transparent text-cyan-600 dark:text-cyan-400"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
    );

    const parentInner = (
        <>
            {(isActive || isChildActive) && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-cyan-500 to-emerald-500 shadow-sm" />
            )}

            <Icon
                className={clsx(
                    "w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                    (isActive || isChildActive)
                        ? "text-cyan-600 dark:text-cyan-400"
                        : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                )}
            />

            {!isCollapsed && (
                <span className="truncate flex-1 tracking-wide text-left">{item.label}</span>
            )}

            {!isCollapsed && hasChildren && (
                <ChevronDown
                    className={clsx(
                        "w-4 h-4 shrink-0 transition-transform duration-200",
                        open && "rotate-180"
                    )}
                />
            )}

            {!isCollapsed && !hasChildren && item.badge && (
                <span
                    className={clsx(
                        "px-2 py-0.5 text-[12px] rounded-full shrink-0 shadow-sm",
                        item.badge.color === "primary" && "bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800",
                        item.badge.color === "error" && "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800",
                        item.badge.color === "info" && "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800",
                        item.badge.color === "warning" && "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800",
                        (!item.badge.color || item.badge.color === "default") && "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    )}
                >
                    {item.badge.text}
                </span>
            )}
        </>
    );

    const parent = hasChildren ? (
        <button type="button" onClick={handleParentClick} className={linkOrToggleClasses}>
            {parentInner}
        </button>
    ) : (
        <Link href={item.href || "#"} className={linkOrToggleClasses}>
            {parentInner}
        </Link>
    );

    const wrappedParent = isCollapsed ? (
        <Tooltip title={item.label} placement="right" arrow>
            <div className="my-0.5 flex justify-center">{parent}</div>
        </Tooltip>
    ) : (
        <div className="my-0.5 px-2">{parent}</div>
    );

    if (!hasChildren) return wrappedParent;

    return (
        <div>
            {wrappedParent}
            {!isCollapsed && open && (
                <div className="ml-6 pl-3 border-l border-zinc-200 dark:border-zinc-800 flex flex-col gap-0.5">
                    {item.children!.map((child) => {
                        const ChildIcon = child.icon;
                        const childActive = isRouteActive(child.href);
                        return (
                            <Link
                                key={child.id || child.href}
                                href={child.href || "#"}
                                className={clsx(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                                    childActive
                                        ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-medium"
                                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
                                )}
                            >
                                {ChildIcon && (
                                    <ChildIcon
                                        className={clsx(
                                            "w-4 h-4 shrink-0",
                                            childActive
                                                ? "text-cyan-600 dark:text-cyan-400"
                                                : "text-zinc-500 dark:text-zinc-400"
                                        )}
                                    />
                                )}
                                <span className="truncate flex-1">{child.label}</span>
                                {child.badge && (
                                    <span
                                        className={clsx(
                                            "px-2 py-0.5 text-[11px] rounded-full shrink-0",
                                            child.badge.color === "primary" && "bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800",
                                            child.badge.color === "error" && "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800",
                                            child.badge.color === "info" && "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800",
                                            child.badge.color === "warning" && "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800",
                                            (!child.badge.color || child.badge.color === "default") && "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                                        )}
                                    >
                                        {child.badge.text}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};