"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface SidebarContextType {
    isCollapsed: boolean;
    isMobileOpen: boolean;
    searchQuery: string;
    userRole: string;
    toggleCollapse: () => void;
    setIsCollapsed: (collapsed: boolean) => void;
    toggleMobile: () => void;
    setIsMobileOpen: (open: boolean) => void;
    setSearchQuery: (query: string) => void;
    setUserRole: (role: string) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [userRole, setUserRole] = useState<string>("admin");
    const pathname = usePathname();

    // Close mobile drawer on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    // Handle responsive collapse auto behavior on screen resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleCollapse = () => setIsCollapsed((prev) => !prev);
    const toggleMobile = () => setIsMobileOpen((prev) => !prev);

    return (
        <SidebarContext.Provider
            value={{
                isCollapsed,
                isMobileOpen,
                searchQuery,
                userRole,
                toggleCollapse,
                setIsCollapsed,
                toggleMobile,
                setIsMobileOpen,
                setSearchQuery,
                setUserRole,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = (): SidebarContextType => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};
