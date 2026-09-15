"use client";

import React, { useState } from "react";
import { useSidebar } from "../SidebarContext/SidebarContext";
import { Menu as MenuIcon, Bell } from "lucide-react";
import { Tooltip, IconButton, Badge, Menu } from "@mui/material";
import { SidebarProfile } from "../Sidebar/SidebarProfile";

export const Header: React.FC = () => {
    const { toggleMobile } = useSidebar();
    const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);

    return (
        <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-zinc-200 transition-colors duration-300 px-4 lg:px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
                <button
                    onClick={toggleMobile}
                    className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 lg:hidden transition-colors"
                    aria-label="Toggle navigation menu"
                >
                    <MenuIcon size={20} />
                </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                {/* Notifications Bell */}
                <Tooltip title="Notifications">
                    <IconButton
                        onClick={(e) => setNotifAnchorEl(e.currentTarget)}
                        className="text-zinc-600 hover:bg-zinc-100"
                    >
                        <Badge badgeContent={5} color="error">
                            <Bell size={18} />
                        </Badge>
                    </IconButton>
                </Tooltip>

                {/* Notifications Popover */}
                <Menu
                    anchorEl={notifAnchorEl}
                    open={Boolean(notifAnchorEl)}
                    onClose={() => setNotifAnchorEl(null)}
                    slotProps={{ paper: { className: "bg-white border border-zinc-200 shadow-2xl rounded-2xl w-80 mt-2 p-1" } }}
                >
                    <div className="px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
                        <span className="font-bold text-sm text-zinc-900">Notifications</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-600">5 New</span>
                    </div>

                    <div className="divide-y divide-zinc-100 max-h-72 overflow-y-auto">
                        <div className="p-3 hover:bg-zinc-100 transition-colors cursor-pointer">
                            <p className="text-xs font-bold text-zinc-800">New Application for Sr. React Developer</p>
                            <p className="text-[11px] text-zinc-500 mt-0.5">Alex Johnson applied 10 mins ago</p>
                        </div>
                        <div className="p-3 hover:bg-zinc-100 transition-colors cursor-pointer">
                            <p className="text-xs font-bold text-zinc-800">Interview Scheduled</p>
                            <p className="text-[11px] text-zinc-500 mt-0.5">Sarah Connor • Tomorrow at 2:00 PM</p>
                        </div>
                    </div>
                </Menu>

                <SidebarProfile />
            </div>
        </header>
    );
};

