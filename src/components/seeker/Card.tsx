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

export interface CardProps {
    title: string;
    subtitle?: string;
    canRemove?: boolean;
    onRemove?: () => void;
    defaultExpanded?: boolean;
    preview?: React.ReactNode;
    children: React.ReactNode;
    startDate?: string;
    endDate?: string;
    isCurrent?: boolean;
    removing?: boolean;
}

export function Card({
    title,
    subtitle,
    canRemove = false,
    onRemove,
    defaultExpanded = true,
    expanded: controlledExpanded,
    onToggle,
    preview,
    children,
    startDate,
    endDate,
    isCurrent,
    removing = false,
}: CardProps & { expanded?: boolean; onToggle?: () => void }) {
    const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultExpanded);
    const isExpanded = controlledExpanded !== undefined ? controlledExpanded : uncontrolledExpanded;

    const handleToggle = () => {
        if (onToggle) {
            onToggle();
        } else {
            setUncontrolledExpanded((prev) => !prev);
        }
    };

    return (
        <MuiCard
            variant="outlined"
            sx={{
                borderRadius: "12px",
                borderColor: isExpanded ? "rgba(7, 196, 236, 0.4)" : "#ffffff",
                borderWidth: "1px",
                boxShadow: isExpanded
                    ? "0 4px 14px rgba(7, 196, 236, 0.12)"
                    : "0 2px 8px rgba(7, 196, 236, 0.08)",
                overflow: "hidden",
                transition: "all 0.2s ease-in-out",
                opacity: removing ? 0.5 : 1,
                pointerEvents: removing ? "none" : "auto",
            }}
        >
            <Box
                onClick={handleToggle}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",
                    bgcolor: isExpanded ? "rgba(7, 196, 236, 0.04)" : "transparent",
                    transition: "background-color 0.2s ease",
                    borderBottom: isExpanded ? "1px solid rgba(7, 196, 236, 0.18)" : "none",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, overflow: "hidden" }}>
                    <Collapse in={!isExpanded} timeout="auto" unmountOnExit>
                        <CardContent sx={{ p: 1, py: 0.5 }}>
                            {preview ? (
                                preview
                            ) : (
                                <Box sx={{ color: "#6b7280" }}>
                                    <Typography variant="h6" sx={{ color: "#000000", fontSize: "16px", fontWeight: 600 }}>
                                        {title || "Untitled"}
                                    </Typography>
                                    {subtitle && (
                                        <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: "medium", fontSize: "14px" }}>
                                            {subtitle}
                                        </Typography>
                                    )}
                                    {(startDate || endDate || isCurrent) && (
                                        <Typography variant="caption" sx={{ color: "#9ca3af", display: "block" }}>
                                            {startDate || ""} - {isCurrent ? "Present" : endDate || ""}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </CardContent>
                    </Collapse>
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Typography variant="h6" sx={{ color: "#07c4ec", fontSize: "15px", fontWeight: 600 }}>
                            {title ? `Editing: ${title}` : "New Entry"}
                        </Typography>
                    </Collapse>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    {canRemove && onRemove && (
                        <IconButton
                            size="small"
                            type="button"
                            disabled={removing}
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
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggle();
                        }}
                        sx={{
                            color: "#07c4ec",
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                        <ChevronDown className="w-5 h-5 text-[#07c4ec]" />
                    </IconButton>
                </Box>
            </Box>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
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
    onRemoveItem?: (item: T, index: number) => Promise<boolean> | boolean;
}

export function DynamicCardSection<T = any>({
    name,
    title,
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
    onRemoveItem,
}: DynamicCardSectionProps<T>) {
    const { values } = useFormikContext<any>();
    const items: T[] = values?.[name] || [];
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [removingIndex, setRemovingIndex] = useState<number | null>(null);

    return (
        <FieldArray name={name}>
            {({ insert, remove }) => {
                const handleAddNewOnTop = () => {
                    insert(0, { ...initialEmptyItem });
                    setOpenIndex(0); // Open the new box at the top
                };

                const handleRemove = async (index: number) => {
                    const item = items[index];

                    if (onRemoveItem) {
                        setRemovingIndex(index);
                        try {
                            const shouldRemove = await onRemoveItem(item, index);
                            if (!shouldRemove) {
                                setRemovingIndex(null);
                                return; // backend delete failed — keep the card
                            }
                        } catch (err) {
                            console.error("onRemoveItem failed:", err);
                            setRemovingIndex(null);
                            return;
                        }
                        setRemovingIndex(null);
                    }

                    remove(index);
                    if (openIndex === index) {
                        setOpenIndex(null);
                    } else if (openIndex !== null && openIndex > index) {
                        setOpenIndex(openIndex - 1);
                    }
                };

                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                            </div>

                            <Button
                                variant="outlined"
                                size="small"
                                type="button"
                                startIcon={<Plus className="w-4 h-4" />}
                                onClick={handleAddNewOnTop}
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
                                    p: 2.7,
                                    textAlign: "center",
                                    bgcolor: "rgba(7, 196, 236, 0.02)",
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 600, color: "#374151" }}>
                                    {emptyTitle}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
                                    {emptySubtext}
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="small"
                                    type="button"
                                    startIcon={<Plus className="w-4 h-4" />}
                                    onClick={handleAddNewOnTop}
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

                                    const isCardExpanded = openIndex === index;

                                    return (
                                        <Card
                                            key={`${name}-${index}`}
                                            title={cardTitle}
                                            subtitle={cardSubtitle}
                                            startDate={cardStartDate}
                                            endDate={cardEndDate}
                                            isCurrent={cardIsCurrent}
                                            canRemove={items.length > 0}
                                            onRemove={() => handleRemove(index)}
                                            expanded={isCardExpanded}
                                            onToggle={() => setOpenIndex(isCardExpanded ? null : index)}
                                            preview={renderPreview ? renderPreview(namePrefix, index, item) : undefined}
                                            removing={removingIndex === index}
                                        >
                                            {renderItem(namePrefix, index, item)}
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            }}
        </FieldArray>
    );
}