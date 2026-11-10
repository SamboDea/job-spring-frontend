"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { FileText } from "lucide-react";
import useCvData from "../generate-cv/useGenerateCV";
import type { CvData } from "../generate-cv/types";
import { buildFileName, imageToDataUrl } from "@/src/lib/utils";
import CvTemplateModal from "./CvTemplateModal";
import type { CvTemplateId } from "./CvDocument";

const saveBlobUrl = (url: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
};

const showLoading = () =>
    Swal.fire({
        title: "Preparing your CV",
        text: "This will only take a moment...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
    });

const showSuccess = () =>
    Swal.fire({
        icon: "success",
        title: "Download successful!",
        text: "Your CV has been downloaded.",
        timer: 2500,
        showConfirmButton: false
    });

const showError = () =>
    Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "We could not generate your CV. Please try again.",
        confirmButtonText: "Close",
        confirmButtonColor: "#5730de",
    });

export default function GenerateCvButton() {
    const { build, isReady } = useCvData();
    const [busy, setBusy] = useState(false);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [previewData, setPreviewData] = useState<CvData | null>(null);
    const [template, setTemplate] = useState<CvTemplateId>("modern");

    const openPicker = () => {
        const data = build();
        if (!data) return;
        setPreviewData(data);
        setPickerOpen(true);
    };

    const handleGenerate = async (selected: CvTemplateId, previewUrl?: string) => {
        const data = previewData ?? build();
        if (!data) return;

        setTemplate(selected);


        if (previewUrl) {
            saveBlobUrl(previewUrl, buildFileName(data.fullName));
            setPickerOpen(false);
            void showSuccess();
            return;
        }

        setPickerOpen(false);
        setBusy(true);
        void showLoading();

        try {
            const profile = await imageToDataUrl(data.profile);
            const cvData = { ...data, profile };

            const [{ pdf }, { default: CvDocument }] = await Promise.all([
                import("@react-pdf/renderer"),
                import("./CvDocument"),
            ]);
            const blob = await pdf(
                <CvDocument data={cvData} template={selected} />
            ).toBlob();

            const url = URL.createObjectURL(blob);
            saveBlobUrl(url, buildFileName(data.fullName));
            URL.revokeObjectURL(url);

            void showSuccess();
        } catch (e) {
            console.error(e);
            void showError();
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="w-full md:w-auto md:max-w-xs">
            <button
                type="button"
                onClick={openPicker}
                disabled={!isReady || busy}
                className="cursor-pointer inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-[#696CFF] px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <FileText className="w-5 h-5" />
                Generate CV
            </button>

            {!isReady && (
                <p className="mt-2 text-xs text-gray-400">
                    Add experience or education to continue
                </p>
            )}

            <CvTemplateModal
                open={pickerOpen}
                data={previewData}
                initial={template}
                onClose={() => setPickerOpen(false)}
                onSelect={handleGenerate}
            />
        </div>
    );
}