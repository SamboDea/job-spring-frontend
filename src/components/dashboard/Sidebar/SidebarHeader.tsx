"use client";

import React from "react";
import Link from "next/link";
import { useSidebar } from "../SidebarContext/SidebarContext";
import { PanelLeftClose, PanelLeftOpen, Sparkles, Building } from "lucide-react";
import { Tooltip, IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import Image from "next/image";
import Logo from "../../../../public/logo/logo.png";

export const SidebarHeader: React.FC = () => {
    const { isCollapsed, toggleCollapse } = useSidebar();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [workspace, setWorkspace] = React.useState("Enterprise Hiring");

    const handleOpenWorkspace = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseWorkspace = (name?: string) => {
        if (name) setWorkspace(name);
        setAnchorEl(null);
    };

    return (
        <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-200 dark:border-zinc-800 transition-all duration-300">
            <div className="flex items-center gap-3 overflow-hidden">
                <Link href="/dashboard" className="flex items-center gap-2.5 group">
                    {!isCollapsed && (
                        <div className="flex flex-col min-w-0">
                            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-600 via-emerald-600 to-lime-600 dark:from-cyan-400 dark:via-emerald-400 dark:to-lime-400 bg-clip-text text-transparent truncate">
                                <Image src={Logo} alt="JobSpring Logo" width={200} height={200} priority />
                            </span>
                            {/* <button
                                onClick={handleOpenWorkspace}
                                className="text-[11px] font-medium text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 flex items-center gap-1 truncate transition-colors text-left"
                            >
                                <span className="truncate">{workspace}</span>
                                <span className="text-[9px]">▼</span>
                            </button> */}
                        </div>
                    )}
                </Link>
            </div>

            <Tooltip title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"} placement="right">
                <IconButton
                    onClick={toggleCollapse}
                    size="small"
                >
                    {isCollapsed ? <PanelLeftOpen className="text-zinc-500 dark:text-zinc-400" size={24} /> : <PanelLeftClose className="text-zinc-500 dark:text-zinc-400" size={24} />}
                </IconButton>
            </Tooltip>
            {/* <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleCloseWorkspace()}
                slotProps={{ paper: { className: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl mt-1 min-w-[200px]" } }}
            >
                <MenuItem onClick={() => handleCloseWorkspace("Enterprise Hiring")}>
                    <ListItemIcon><Building size={16} /></ListItemIcon>
                    <ListItemText primary={<span className="text-sm font-medium">Enterprise Hiring</span>} />
                </MenuItem>
                <MenuItem onClick={() => handleCloseWorkspace("Tech Team Talent Pool")}>
                    <ListItemIcon><Building size={16} /></ListItemIcon>
                    <ListItemText primary={<span className="text-sm font-medium">Tech Team Talent Pool</span>} />
                </MenuItem>
                <MenuItem onClick={() => handleCloseWorkspace("Global Operations")}>
                    <ListItemIcon><Building size={16} /></ListItemIcon>
                    <ListItemText primary={<span className="text-sm font-medium">Global Operations</span>} />
                </MenuItem>
            </Menu> */}
        </div>
    );
};
