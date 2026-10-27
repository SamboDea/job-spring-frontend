"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import useCvData from "../generate-cv/useGenerateCV";
import { buildFileName, imageToDataUrl } from "@/src/lib/utils";
import GeneratingCvModal, { type CvStatus } from "./GeneratingCvModal";

const STEP_DELAYS = {
    collect: 2000,
    build: 2500,
    download: 1500,
};
const SUCCESS_VISIBLE_MS = 3000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function GenerateCvButton() {
    const { build, isReady } = useCvData();
    const [status, setStatus] = useState<CvStatus>("idle");
    const [step, setStep] = useState(0);

    const handleGenerate = async () => {
        const data = build();
        if (!data) return;

        try {
            setStatus("loading");

            setStep(0);
            const [profile] = await Promise.all([
                imageToDataUrl(data.profile),
                sleep(STEP_DELAYS.collect),
            ]);
            const cvData = { ...data, profile };

            setStep(1);
            const [{ pdf }, { default: CvDocument }] = await Promise.all([
                import("@react-pdf/renderer"),
                import("./CvDocument"),
            ]);
            const [blob] = await Promise.all([
                pdf(<CvDocument data={cvData} />).toBlob(),
                sleep(STEP_DELAYS.build),
            ]);

            setStep(2);
            await sleep(STEP_DELAYS.download);

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = buildFileName(data.fullName);
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            setStatus("success");
            setTimeout(() => setStatus("idle"), SUCCESS_VISIBLE_MS);
        } catch (e) {
            console.error(e);
            setStatus("error");
        }
    };

    return (
        <div className="w-full md:w-auto">
            <button
                type="button"
                onClick={handleGenerate}
                disabled={!isReady || status === "loading"}
                className="cursor-pointer flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-[#696CFF] px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <FileText className="w-5 h-5" />
                Generate CV
            </button>

            {!isReady && (
                <p className="mt-2 text-xs text-gray-400">
                    Add at least one work experience or education to generate your CV.
                </p>
            )}

            <GeneratingCvModal
                status={status}
                step={step}
                onClose={() => setStatus("idle")}
            />
        </div>
    );
}