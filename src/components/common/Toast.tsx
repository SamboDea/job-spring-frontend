"use client";

import React, { useState, useCallback, useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import clsx from "clsx";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
    id?: string;
    type: ToastType;
    msg: string;
}

interface ToastProps {
    toast: ToastMessage | null;
    onClose?: () => void;
    durationMs?: number;
}

export function Toast({ toast, onClose, durationMs = 3500 }: ToastProps) {
    useEffect(() => {
        if (!toast || !onClose) return;
        const timer = setTimeout(() => {
            onClose();
        }, durationMs);
        return () => clearTimeout(timer);
    }, [toast, onClose, durationMs]);

    if (!toast) return null;

    return (
        <div
            className={clsx(
                "fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all transform animate-in fade-in slide-in-from-top-4 duration-200 border",
                toast.type === "success" &&
                    "bg-emerald-500 text-white border-emerald-400/40 shadow-emerald-500/20",
                toast.type === "error" &&
                    "bg-rose-500 text-white border-rose-400/40 shadow-rose-500/20",
                toast.type === "info" &&
                    "bg-cyan-500 text-white border-cyan-400/40 shadow-cyan-500/20"
            )}
        >
            {toast.type === "success" && <CheckCircle2 size={18} className="shrink-0" />}
            {toast.type === "error" && <AlertCircle size={18} className="shrink-0" />}
            {toast.type === "info" && <Info size={18} className="shrink-0" />}

            <span>{toast.msg}</span>

            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="ml-2 opacity-80 hover:opacity-100 transition p-0.5 rounded-lg hover:bg-white/20"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}

export function useToast(durationMs = 3500) {
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const showToast = useCallback((type: ToastType, msg: string) => {
        setToast({ id: Date.now().toString(), type, msg });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    const ToastComponent = useCallback(
        () => <Toast toast={toast} onClose={hideToast} durationMs={durationMs} />,
        [toast, hideToast, durationMs]
    );

    return {
        toast,
        showToast,
        hideToast,
        ToastComponent,
    };
}
