"use client";

import React, { useState } from "react";
import { FieldArray, useFormikContext } from "formik";
import {
    Box,
    Card as MuiCard,
    CardContent,
    Collapse,
    IconButton,
    Typography,
    Button,
} from "@mui/material";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                1. Card Props                               */
/* -------------------------------------------------------------------------- */
export interface CardProps {
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    canRemove?: boolean;
    onRemove?: () => void;
    defaultExpanded?: boolean;
    preview?: React.ReactNode;
    children: React.ReactNode;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
}


export function Card({
    title,
    subtitle,
    icon,
    canRemove = false,
    onRemove,
    defaultExpanded = true,
    preview,
    children,
    startDate,
    endDate,
    isCurrent,
}: CardProps) {
    const [expanded, setExpanded] = useState(defaultExpanded);

    return (
        <MuiCard
            variant="outlined"
            sx={{
                borderRadius: "12px",
                borderColor: "#ffffff",
                borderWidth: "1px",
                boxShadow: "0 2px 8px rgba(7, 196, 236, 0.08)",
                overflow: "hidden",
                transition: "all 0.2s ease-in-out",
            }}
        >
            <Box
                onClick={() => setExpanded((prev) => !prev)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2.5,
                    py: 1.75,
                    cursor: "pointer",
                    bgcolor: expanded ? "rgba(7, 196, 236, 0.04)" : "transparent",
                    transition: "background-color 0.2s ease",
                    borderBottom: expanded ? "1px solid rgba(7, 196, 236, 0.18)" : "none",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, overflow: "hidden" }}>
                    {icon && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: 38,
                                height: 38,
                                borderRadius: "10px",
                                bgcolor: "rgba(7, 196, 236, 0.12)",
                                color: "#07c4ec",
                                flexShrink: 0,
                            }}
                        >
                            {icon}
                        </Box>
                    )}
                    {/* <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 600,
                                color: "#1f2937",
                                lineHeight: 1.2,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#07c4ec",
                                    fontWeight: 500,
                                    mt: 0.25,
                                    display: "block",
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box> */}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {canRemove && onRemove && (
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                            sx={{
                                color: "#9ca3af",
                                "&:hover": {
                                    color: "#ff3e1d",
                                    bgcolor: "rgba(255, 62, 29, 0.08)",
                                },
                            }}
                            aria-label="Delete card"
                        >
                            <Trash2 className="w-4 h-4" />
                        </IconButton>
                    )}

                    <IconButton
                        size="small"
                        sx={{
                            color: "#07c4ec",
                            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        aria-label={expanded ? "Collapse" : "Expand"}
                    >
                        <ChevronDown className="w-5 h-5 text-[#07c4ec]" />
                    </IconButton>
                </Box>
            </Box>

            <Collapse in={!expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ p: 3, pt: 2.5 }}>
                    {preview ?? (
                        <Box sx={{ color: "#6b7280" }}>
                            <Typography variant="h4">{title}</Typography>
                            {subtitle && <Typography variant="h5">{subtitle}</Typography>}
                            <Typography variant="h6" sx={{ color: "#6b7280" }}>{startDate} - {isCurrent ? "Present" : endDate}</Typography>
                        </Box>
                    )}
                </CardContent>
            </Collapse>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ p: 3, pt: 2.5 }}>
                    {children}
                </CardContent>
            </Collapse>
        </MuiCard>
    );
}

export interface DynamicCardSectionProps<T = any> {
    name: string;
    title: string;
    subtitle?: string;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    icon?: React.ReactNode;
    emptyTitle?: string;
    emptySubtext?: string;
    addButtonText?: string;
    initialEmptyItem: T;
    getItemTitle?: (item: T, index: number) => string;
    getItemSubtitle?: (item: T, index: number) => string;
    getItemStartDate?: (item: T, index: number) => string | null | undefined;
    getItemEndDate?: (item: T, index: number) => string | null | undefined;
    getItemIsCurrent?: (item: T, index: number) => boolean | undefined;
    renderItem: (namePrefix: string, index: number, item: T) => React.ReactNode;
    renderPreview?: (namePrefix: string, index: number, item: T) => React.ReactNode;
}

export function DynamicCardSection<T = any>({
    name,
    title,
    icon,
    emptyTitle = `No ${title.toLowerCase()} added yet`,
    emptySubtext = `Add your ${title.toLowerCase()} details here.`,
    addButtonText = `Add ${title}`,
    initialEmptyItem,
    getItemTitle,
    getItemSubtitle,
    getItemStartDate,
    getItemEndDate,
    getItemIsCurrent,
    renderItem,
    renderPreview,
}: DynamicCardSectionProps<T>) {
    const { values } = useFormikContext<any>();
    const items: T[] = values?.[name] || [];

    return (
        <FieldArray name={name}>
            {({ push, remove }) => (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {icon}
                            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                            <span className="text-xs h-6 w-6 flex items-center justify-center px-2 py-0.5 rounded-full bg-cyan-50 text-[#07c4ec] border border-[#07c4ec]/30 font-medium">
                                {items.length}
                            </span>
                        </div>

                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Plus className="w-4 h-4" />}
                            onClick={() => push({ ...initialEmptyItem })}
                            sx={{
                                color: "#07c4ec",
                                borderColor: "#07c4ec",
                                borderRadius: "8px",
                                textTransform: "none",
                                fontWeight: 600,
                                "&:hover": {
                                    borderColor: "#07c4ec",
                                    bgcolor: "rgba(7, 196, 236, 0.08)",
                                },
                            }}
                        >
                            {addButtonText}
                        </Button>
                    </div>

                    {items.length === 0 ? (
                        <Box
                            sx={{
                                border: "1.5px dashed rgba(7, 196, 236, 0.35)",
                                borderRadius: "12px",
                                p: 4,
                                textAlign: "center",
                                bgcolor: "rgba(7, 196, 236, 0.02)",
                            }}
                        >
                            {icon && (
                                <div className="flex justify-center mb-2 opacity-70">
                                    {icon}
                                </div>
                            )}
                            <Typography variant="body1" sx={{ fontWeight: 600, color: "#374151" }}>
                                {emptyTitle}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
                                {emptySubtext}
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<Plus className="w-4 h-4" />}
                                onClick={() => push({ ...initialEmptyItem })}
                                sx={{
                                    bgcolor: "#07c4ec",
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    "&:hover": {
                                        bgcolor: "#05a8cc",
                                    },
                                }}
                            >
                                {addButtonText}
                            </Button>
                        </Box>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item, index) => {
                                const cardTitle = getItemTitle
                                    ? getItemTitle(item, index)
                                    : `Item #${index + 1}`;
                                const cardSubtitle = getItemSubtitle
                                    ? getItemSubtitle(item, index)
                                    : undefined;
                                const namePrefix = `${name}[${index}]`;
                                const cardStartDate = getItemStartDate
                                    ? getItemStartDate(item, index) ?? undefined
                                    : undefined;
                                const cardEndDate = getItemEndDate
                                    ? getItemEndDate(item, index) ?? undefined
                                    : undefined;
                                const cardIsCurrent = getItemIsCurrent
                                    ? getItemIsCurrent(item, index)
                                    : undefined;

                                return (
                                    <Card
                                        key={index}
                                        title={cardTitle}
                                        subtitle={cardSubtitle}
                                        startDate={cardStartDate}
                                        endDate={cardEndDate}
                                        isCurrent={cardIsCurrent}
                                        icon={icon}
                                        canRemove={items.length > 0}
                                        onRemove={() => remove(index)}
                                        defaultExpanded={index === items.length - 1}
                                        preview={renderPreview ? renderPreview(namePrefix, index, item) : undefined}
                                    >
                                        {renderItem(namePrefix, index, item)}
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </FieldArray>
    );
}