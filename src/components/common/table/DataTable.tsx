"use client";

import React from "react";
import clsx from "clsx";
import { DataTableProps } from "./types";

export function DataTable<T>({
    data,
    columns,
    keyExtractor,
    emptyMessage = "No items found.",
    emptyIcon,
    totalCount,
    className,
    footerLeft,
    footerRight,
}: DataTableProps<T>) {
    return (
        <div className={clsx("overflow-x-auto", className)}>
            <table className="w-full text-left text-xs text-zinc-600 dark:text-zinc-400">
                <thead className="text-[13px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-zinc-50/60 dark:bg-zinc-800/30 border-b border-zinc-100 dark:border-zinc-800">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={clsx(
                                    "px-5 py-3",
                                    col.align === "center" && "text-center",
                                    col.align === "right" && "text-right",
                                    col.headerClassName
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-5 py-14 text-center text-zinc-400 dark:text-zinc-500"
                            >
                                <div className="flex flex-col items-center gap-2">
                                    {emptyIcon}
                                    <span>{emptyMessage}</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        data.map((item) => (
                            <tr
                                key={keyExtractor(item)}
                                className="hover:bg-zinc-100/60 dark:hover:bg-zinc-800/30 transition-colors group"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={clsx(
                                            "px-5 py-4",
                                            col.align === "center" && "text-center",
                                            col.align === "right" && "text-right",
                                            col.className
                                        )}
                                    >
                                        {col.render(item)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {(footerLeft || footerRight || totalCount !== undefined) && (
                <div className="px-6 py-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
                    <div>
                        {footerLeft ?? (
                            <span>
                                Showing {data.length} of {totalCount ?? data.length} items
                            </span>
                        )}
                    </div>
                    {footerRight && <div>{footerRight}</div>}
                </div>
            )}
        </div>
    );
}
