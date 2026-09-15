import { ReactNode } from "react";

export interface TableColumn<T> {
    key: string;
    header: ReactNode;
    render: (item: T) => ReactNode;
    align?: "left" | "center" | "right";
    className?: string;
    headerClassName?: string;
}

export interface DataTableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    keyExtractor: (item: T) => string;
    emptyMessage?: string;
    emptyIcon?: ReactNode;
    totalCount?: number;
    className?: string;
    footerLeft?: ReactNode;
    footerRight?: ReactNode;
}

export interface TableHeaderToolbarProps {
    title: string;
    count?: number;
    subtitle?: string;
    searchQuery?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    filters?: ReactNode;
    actions?: ReactNode;
    isPending?: boolean;
    className?: string;
}
