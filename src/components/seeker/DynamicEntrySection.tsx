"use client";

import { useMemo, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { Plus } from "lucide-react";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { EntryCard } from "./EntryCard";
import { EntryFieldConfig, EntryListItem } from "@/src/types/dynamic-entry";

interface DynamicEntrySectionProps {
    title: string;
    entries: EntryListItem[];
    fields: EntryFieldConfig[];
    validationSchema: Yup.ObjectSchema<any>;
    emptyValues: Record<string, any>;
    getTitle: (item: EntryListItem) => string;
    getSubtitle?: (item: EntryListItem) => string | undefined;
    getStartDate?: (item: EntryListItem) => string | undefined;
    getEndDate?: (item: EntryListItem) => string | undefined;
    getIsCurrent?: (item: EntryListItem) => boolean | undefined;
    onCreate: (values: Record<string, any>) => Promise<void>;
    onUpdate: (id: number, values: Record<string, any>) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}

export function DynamicEntrySection({
    title,
    entries,
    fields,
    validationSchema,
    emptyValues,
    getTitle,
    getSubtitle,
    getStartDate,
    getEndDate,
    getIsCurrent,
    onCreate,
    onUpdate,
    onDelete,
}: DynamicEntrySectionProps) {
    const [showNew, setShowNew] = useState(false);
    const [openId, setOpenId] = useState<number | "new" | null>(null);
    const [savingId, setSavingId] = useState<number | "new" | null>(null);
    const [removingId, setRemovingId] = useState<number | null>(null);

    const sortedEntries = useMemo(
        () => [...entries].sort((a, b) => b.id - a.id),
        [entries]
    );

    const handleAddNew = () => {
        setShowNew(true);
        setOpenId("new");
    };

    const handleCancelNew = () => {
        setShowNew(false);
        setOpenId(null);
    };

    const handleCreate = async (values: Record<string, any>) => {
        setSavingId("new");
        try {
            await onCreate(values);
            setShowNew(false);
            setOpenId(null);
        } finally {
            setSavingId(null);
        }
    };

    const handleUpdate = async (id: number, values: Record<string, any>) => {
        setSavingId(id);
        try {
            await onUpdate(id, values);
        } finally {
            setSavingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });
        if (!result.isConfirmed) return;

        setRemovingId(id);
        try {
            await onDelete(id);
            if (openId === id) setOpenId(null);
            await Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
                timer: 2500,
                showConfirmButton: false,
            });
        } finally {
            setRemovingId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-1">
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "16px", color: "#696CFF" }}>
                    {title}
                </Typography>
                {!showNew && (
                    <Button
                        variant="outlined"
                        size="small"
                        type="button"
                        onClick={handleAddNew}
                        aria-label="Add new"
                        sx={{
                            color: "#696CFF",
                            borderColor: "#D7F5FC",
                            backgroundColor: "#E7E7FF",
                            borderRadius: "50%",
                            minWidth: 0,
                            width: 25,
                            height: 25,
                            p: 0,
                            "&:hover": {
                                backgroundColor: "#C2EFFA",
                                borderColor: "#C2EFFA",
                            },
                        }}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {
                sortedEntries.length === 0 && !showNew ? (
                    <Box
                        sx={{
                            border: "1.5px dashed rgba(7, 196, 236, 0.35)",
                            borderRadius: "12px",
                            p: 2.7,
                            textAlign: "center",
                            bgcolor: "rgba(7, 196, 236, 0.02)",
                        }}
                    >
                        <Typography sx={{ fontWeight: 600, color: "#374151" }}>
                            No {title.toLowerCase()} added yet
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#6b7280", mb: 2 }}>
                            Add your {title.toLowerCase()} details here.
                        </Typography>
                        {/* <Button
                            variant="outlined"
                            size="small"
                            type="button"
                            onClick={handleAddNew}
                            aria-label="Add new"
                            sx={{
                                color: "#2BCDEF",
                                borderColor: "#D7F5FC",
                                backgroundColor: "#D7F5FC",
                                borderRadius: "50%",
                                minWidth: 0,
                                width: 25,
                                height: 25,
                                p: 0,
                                "&:hover": {
                                    backgroundColor: "#C2EFFA",
                                    borderColor: "#C2EFFA",
                                },
                            }}
                        >
                            <Plus className="w-4 h-4" />
                        </Button> */}
                    </Box>
                ) : (
                    <div className="">
                        {showNew && (
                            <EntryCard
                                id="new"
                                values={emptyValues}
                                fields={fields}
                                validationSchema={validationSchema}
                                title=""
                                expanded={openId === "new"}
                                onToggle={() => setOpenId(openId === "new" ? null : "new")}
                                onSave={handleCreate}
                                onCancelNew={handleCancelNew}
                                saving={savingId === "new"}
                                removing={false}
                            />
                        )}

                        {sortedEntries.map((entry) => (
                            <EntryCard
                                key={entry.id}
                                id={entry.id}
                                values={entry}
                                fields={fields}
                                validationSchema={validationSchema}
                                title={getTitle(entry)}
                                subtitle={getSubtitle?.(entry)}
                                startDate={getStartDate?.(entry)}
                                endDate={getEndDate?.(entry)}
                                isCurrent={getIsCurrent?.(entry)}
                                expanded={openId === entry.id}
                                onToggle={() => setOpenId(openId === entry.id ? null : entry.id)}
                                onSave={(values) => handleUpdate(entry.id, values)}
                                onDelete={() => handleDelete(entry.id)}
                                saving={savingId === entry.id}
                                removing={removingId === entry.id}
                            />
                        ))}
                    </div>
                )
            }
        </div >
    );
}