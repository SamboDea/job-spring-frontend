"use client";

import React from "react";
import { useSidebar } from "../SidebarContext/SidebarContext";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarSearch } from "./SidebarSearch";
import { SidebarMenu } from "./SidebarMenu";
import { Drawer } from "@mui/material";
import clsx from "clsx";
import "@/src/assets/styles/globals.css";
import "@/src/assets/styles/website.css";

export const Sidebar: React.FC = () => {
    const { isCollapsed, isMobileOpen, toggleMobile } = useSidebar();

    const sidebarContent = (
        <div className="h-full flex flex-col bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 select-none shadow-sm transition-all duration-300">
            <SidebarHeader />
            <SidebarSearch />
            <SidebarMenu />
        </div>
    );

    return (
        <>
            <aside
                className={clsx(
                    "hidden lg:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ease-in-out",
                    isCollapsed ? "w-[76px]" : "w-[280px]"
                )}
            >
                {sidebarContent}
            </aside>

            <Drawer
                anchor="left"
                open={isMobileOpen}
                onClose={toggleMobile}
                className="block lg:hidden z-50"
                slotProps={{ paper: { className: "w-[280px] border-none bg-transparent shadow-2xl" } }}
            >
                {sidebarContent}
            </Drawer>
        </>
    );
};
