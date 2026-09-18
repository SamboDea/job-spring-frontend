"use client";

import AppLoading from "@/src/components/common/AppLoading";

export function LoadingOverlay({ show }: { show: boolean }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-md">
            <AppLoading size="lg" color="#07c4ec" />
        </div>
    );
}