"use client";

import { createPortal } from "react-dom";
import { CheckCircle2, FileText, Loader2, XCircle } from "lucide-react";

export type CvStatus = "idle" | "loading" | "success" | "error";

const STEPS = [
    "Collecting your profile data",
    "Building your CV",
    "Preparing your download",
];

interface Props {
    status: CvStatus;
    step: number;
    onClose: () => void;
}

export default function GeneratingCvModal({ status, step, onClose }: Props) {
    if (status === "idle") return null;

    const progress = status === "success" ? 100 : Math.round(((step + 1) / STEPS.length) * 100);

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-xl">
                <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
                    {status === "loading" && (
                        <>
                            <span className="absolute inset-0 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-[#696CFF]/20" />
                            <span className="absolute inset-0 rounded-full bg-[#696CFF]/10" />
                            <Loader2
                                className="absolute h-20 w-20 animate-[spin_2.5s_linear_infinite] text-[#696CFF]/40"
                                strokeWidth={1.5}
                            />
                            <FileText className="relative h-8 w-8 animate-[pulse_2s_ease-in-out_infinite] text-[#696CFF]" />
                        </>
                    )}
                    {status === "success" && <CheckCircle2 className="h-16 w-16 text-green-500" />}
                    {status === "error" && <XCircle className="h-16 w-16 text-red-500" />}
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                    {status === "loading" && "Generating your CV"}
                    {status === "success" && "Your CV is ready!"}
                    {status === "error" && "Something went wrong"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    {status === "loading" && `${STEPS[step]}...`}
                    {status === "success" && "Your download has started."}
                    {status === "error" && "We could not generate your CV. Please try again."}
                </p>

                {status !== "error" && (
                    <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full bg-[#696CFF] transition-all duration-[2000ms] ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}

                {status !== "loading" && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer mt-6 rounded-xl bg-[#696CFF] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                        {status === "success" ? "Done" : "Close"}
                    </button>
                )}
            </div>
        </div>,
        document.body
    );
}