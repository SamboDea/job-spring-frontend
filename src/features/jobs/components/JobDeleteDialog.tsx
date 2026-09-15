"use client";

import React from "react";
import { Dialog, DialogContent, DialogActions } from "@mui/material";
import { Trash2 } from "lucide-react";
import { JobPost } from "@/src/actions/jobPost";

interface JobDeleteDialogProps {
    job: JobPost | null;
    onClose: () => void;
    onConfirm: () => void;
}

export default function JobDeleteDialog({
    job,
    onClose,
    onConfirm,
}: JobDeleteDialogProps) {
    if (!job) return null;

    return (
        <Dialog
            open={!!job}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    className:
                        "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl",
                },
            }}
        >
            <DialogContent className="px-6 pt-7 pb-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={22} className="text-rose-500" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    Delete Job Post?
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {job.title}
                    </span>{" "}
                    ({job.jobCode}) will be permanently removed and cannot be recovered.
                </p>
            </DialogContent>
            <DialogActions className="px-6 pb-6 pt-2 gap-3 justify-center">
                <button
                    type="button"
                    onClick={onClose}
                    className="cursor-pointer px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className="cursor-pointer px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition shadow-sm"
                >
                    Yes, Delete
                </button>
            </DialogActions>
        </Dialog>
    );
}
