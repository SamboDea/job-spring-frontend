"use client";

import React from "react";
import { SidebarProvider, useSidebar } from "../SidebarContext/SidebarContext";
import { Sidebar } from "../Sidebar/Sidebar";
import { Header } from "../Header/Header";
import clsx from "clsx";

const InnerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isCollapsed } = useSidebar();

    return (
        <div
            style={{ fontFamily: '"Kantumruy Pro", var(--font-kantumruy-pro), sans-serif' }}
            className="min-h-screen bg-zinc-50/70 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors duration-300"
        >
            {/* Sidebar */}
            <Sidebar />

            {/* Main Wrapper */}
            <div
                className={clsx(
                    "flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0",
                    isCollapsed ? "lg:pl-[76px]" : "lg:pl-[280px]"
                )}
            >
                <Header />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <SidebarProvider>
            <InnerLayout>{children}</InnerLayout>
        </SidebarProvider>
    );
};
