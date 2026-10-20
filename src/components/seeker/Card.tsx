"use client";

import React, { useState } from "react";
import {
    Box,
    Card as MuiCard,
    CardContent,
    Collapse,
    IconButton,
    Typography,
} from "@mui/material";
import { ChevronDown, Trash2 } from "lucide-react";
import { formatDate, htmlToStructuredText } from "@/src/lib/utils";

export interface CardProps {
    title: string;
    subtitle?: string;
    canRemove?: boolean;
    onRemove?: () => void;
    expanded?: boolean;
    onToggle?: () => void;
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
    expanded: controlledExpanded,
    onToggle,
    preview,
    children,
    startDate,
    endDate,
    isCurrent,
    removing = false,
}: CardProps) {
    const [uncontrolledExpanded, setUncontrolledExpanded] = useState(true);
    const isExpanded = controlledExpanded ?? uncontrolledExpanded;
    const isHtml = /<[a-z][\s\S]*>/i.test(subtitle ?? "");

    const handleToggle = () => {
        onToggle ? onToggle() : setUncontrolledExpanded((prev) => !prev);
    };

    return (
        <MuiCard
            variant="outlined"
            sx={{
                overflow: "hidden",
                transition: "all 0.25s ease",
                opacity: removing ? 0.5 : 1,
                pointerEvents: removing ? "none" : "auto",

                border: isExpanded
                    ? "1px solid #E2E8F0 !important"
                    : "1px solid transparent !important",
                borderLeft: isExpanded
                    ? "3px solid #696CFF !important"
                    : "1px solid transparent !important",
                borderBottom: isExpanded
                    ? "1px solid #E2E8F0 !important"
                    : "1px solid #EEF2F6 !important",
                borderRadius: isExpanded ? "12px" : 0,
                bgcolor: isExpanded ? "#F8FAFC" : "transparent",
                boxShadow: isExpanded ? "0 1px 2px rgba(15, 23, 42, 0.04)" : "none",

                "&:hover": {
                    bgcolor: isExpanded ? "#F8FAFC" : "#FAFBFC",
                },
            }}
        >
            <Box
                onClick={handleToggle}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    cursor: "pointer",
                    padding: isExpanded ? "12px 16px !important" : "0px !important",
                    borderBottom: isExpanded ? "1px solid #E2E8F0" : "none",
                    transition: "padding 0.2s ease",
                }}
            >
                <Box sx={{ position: "relative", flex: 1, overflow: "hidden", minHeight: 32 }}>
                    <Collapse in={!isExpanded} timeout="auto" unmountOnExit>
                        <CardContent sx={{ p: 1, py: 0.75, "&:last-child": { pb: 0.75 } }}>
                            {preview ?? (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: "#0F172A",
                                            fontSize: 16,
                                            fontWeight: 600,
                                            lineHeight: 1.35,
                                        }}
                                    >
                                        {title || "Untitled"}
                                    </Typography>
                                    {subtitle && (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "#475569",
                                                fontSize: 15,
                                                lineHeight: 1.5,
                                                whiteSpace: "pre-line",
                                                paddingY: "1px",
                                            }}
                                        >
                                            {isHtml ? htmlToStructuredText(subtitle) : subtitle}
                                        </Typography>
                                    )}
                                    {(startDate || endDate || isCurrent) && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                // color: "#94A3B8",
                                                display: "block",
                                                fontSize: 14,
                                                fontWeight: 500,
                                                letterSpacing: "0.01em",
                                                marginBottom: "0 !important",
                                            }}
                                        >
                                            {startDate && (
                                                <>
                                                    {formatDate(startDate)}
                                                    {isCurrent ? " - Present" : endDate ? ` - ${formatDate(endDate)}` : ""}
                                                </>
                                            )}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </CardContent>
                    </Collapse>
                    <Collapse
                        in={isExpanded}
                        timeout={200}
                        easing={{ enter: "ease-out", exit: "ease-in" }}
                        unmountOnExit
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                color: "#696CFF",
                                textAlign: "left",
                                fontSize: 14,
                                fontWeight: 600,
                                letterSpacing: "0.01em",
                            }}
                        >
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
                                color: "#94A3B8",
                                borderRadius: "8px",
                                transition: "all 0.2s ease",
                                "&:hover": { color: "#EF4444", bgcolor: "rgba(239, 68, 68, 0.08)" },
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
                            borderRadius: "8px",
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease",
                            "&:hover": { bgcolor: "rgba(7, 196, 236, 0.1)" },
                        }}
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                        <ChevronDown className="w-5 h-5 text-[#07c4ec]" />
                    </IconButton>
                </Box>
            </Box>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ p: 3, pt: 2.5, bgcolor: "#FFFFFF" }}>{children}</CardContent>
            </Collapse>
        </MuiCard>
    );
}