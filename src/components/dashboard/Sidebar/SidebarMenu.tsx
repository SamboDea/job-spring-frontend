"use client";

import React from "react";
import { useSidebar } from "../SidebarContext/SidebarContext";
import { menuConfig, MenuGroupType, MenuItemType } from "./menu";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarSubMenu } from "./SidebarSubMenu";

export const SidebarMenu: React.FC = () => {
    const { isCollapsed, searchQuery, userRole } = useSidebar();

    const hasPermission = (roles?: string[]) => {
        if (!roles || roles.length === 0) return true;
        return roles.includes(userRole);
    };

    const filteredGroups: MenuGroupType[] = menuConfig
        .map((group) => {
            const validItems = group.items.filter((item) => {
                if (!hasPermission(item.roles)) return false;

                if (!searchQuery.trim()) return true;

                const q = searchQuery.toLowerCase();
                const matchesItem = item.label.toLowerCase().includes(q);
                const matchesChildren = item.children?.some((child) => child.label.toLowerCase().includes(q));

                return matchesItem || matchesChildren;
            });

            return { ...group, items: validItems };
        })
        .filter((group) => group.items.length > 0);

    return (
        <div className="flex-1 overflow-y-auto py-2 px-1 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800">
            {filteredGroups.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-zinc-400 dark:text-zinc-500">
                    No menu items match "{searchQuery}"
                </div>
            ) : (
                filteredGroups.map((group) => (
                    <div key={group.id} className="mb-4">
                        {!isCollapsed ? (
                            <div className="px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                                {group.title}
                            </div>
                        ) : (
                            <div className="my-2 border-t border-zinc-200 dark:border-zinc-800" />
                        )}

                        <div className="space-y-0.5">
                            {group.items.map((item) =>
                                item.children ? (
                                    <SidebarSubMenu key={item.id} item={item} />
                                ) : (
                                    <SidebarMenuItem key={item.id} item={item} />
                                )
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
