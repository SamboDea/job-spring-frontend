"use client";

import React from "react";
import { Sidebar } from "@/src/components/dashboard/Sidebar/Sidebar";
import { Header } from "@/src/components/dashboard/Header/Header";
import { SidebarProvider, useSidebar } from "@/src/components/dashboard/SidebarContext/SidebarContext";
import clsx from "clsx";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="min-h-screen bg-white">
            <Sidebar />

            <div
                className={clsx(
                    "flex flex-col min-h-screen transition-all duration-300 ease-in-out",
                    isCollapsed ? "lg:pl-[76px]" : "lg:pl-[280px]"
                )}
            >
                <Header />
                <main className="flex-1 p-6 space-y-6">{children}</main>
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardLayoutInner>{children}</DashboardLayoutInner>
        </SidebarProvider>
    );
}