"use client";

import React from "react";
import { useSidebar } from "../SidebarContext/SidebarContext";
import { LogOut, User, Settings, Shield } from "lucide-react";
import { Tooltip, Avatar, Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { encodeUserId } from "@/src/lib/utils";

export const SidebarProfile: React.FC = () => {
    const { isCollapsed, userRole } = useSidebar();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const user = session?.user;
    const displayName = user?.name || user?.email?.split("@")[0] || "User";
    const avatarUrl = user?.image || undefined;

    const encryptedId = user?.id ? encodeUserId(user.id) : "";
    const accountHref = encryptedId ? `/account/${encryptedId}` : "/account";

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    async function handleLogout() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/");
                    router.refresh();
                },
            },
        });
    }

    if (isCollapsed) {
        return (
            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex justify-center">
                <Tooltip title={`${displayName} (${userRole || "User"})`} placement="right">
                    <button onClick={handleOpenMenu} className="relative group">
                        <Avatar
                            alt={displayName}
                            src={avatarUrl}
                            sx={{ width: 36, height: 36 }}
                            className="ring-2 ring-emerald-500/50 group-hover:scale-105 transition-transform"
                        >
                            {!avatarUrl && (displayName?.[0]?.toUpperCase() || <User size={18} />)}
                        </Avatar>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-zinc-900" />
                    </button>
                </Tooltip>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseMenu}
                    slotProps={{ paper: { className: "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl ml-2 min-w-[200px]" } }}
                >
                    <MenuItem component={Link} href={accountHref} onClick={handleCloseMenu}>
                        <ListItemIcon><User size={16} /></ListItemIcon>
                        <ListItemText primary={<span className="text-xs font-semibold">My Account</span>} />
                    </MenuItem>
                    <MenuItem component={Link} href="/dashboard/system/settings" onClick={handleCloseMenu}>
                        <ListItemIcon><Settings size={16} /></ListItemIcon>
                        <ListItemText primary={<span className="text-xs font-semibold">Account Settings</span>} />
                    </MenuItem>
                    <MenuItem onClick={handleLogout} className="text-rose-600 dark:text-rose-400">
                        <ListItemIcon><LogOut size={16} className="text-rose-600 dark:text-rose-400" /></ListItemIcon>
                        <ListItemText primary={<span className="text-xs font-bold text-rose-600 dark:text-rose-400">Logout</span>} />
                    </MenuItem>
                </Menu>
            </div>
        );
    }

    return (
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800">
            <Link
                href={accountHref}
                className="flex items-center gap-3 p-2"
            >
                <div className="relative shrink-0">
                    <Avatar
                        alt={displayName}
                        src={avatarUrl}
                        sx={{ width: 38, height: 38 }}
                        className="ring-2 ring-emerald-500 group-hover:scale-105 transition-transform"
                    >
                        {!avatarUrl && (displayName?.[0]?.toUpperCase() || <User size={18} />)}
                    </Avatar>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-zinc-900" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {displayName}
                    </span>
                    <span className="text-[10px] font-medium text-cyan-600 dark:text-cyan-400 truncate capitalize flex items-center gap-1">
                        <Shield size={10} /> {userRole || "User"}
                    </span>
                </div>
            </Link>
        </div>
    );
};
