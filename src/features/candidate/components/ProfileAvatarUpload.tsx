"use client";

import { authClient } from "@/src/lib/auth-client";
import { UserRound, Camera, Loader2, MapPin, AtSign } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { successAlert, errorAlert } from "@/src/lib/alert";
import { usePersonalInfoForm } from "../personal-information/usePersonalInfoForm";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

type UploadStatus = "idle" | "uploading";

export default function ProfileAvatarUpload({
    initialImageUrl,
}: {
    initialImageUrl?: string | null;
}) {
    const { data: session } = authClient.useSession();
    const { initialValues } = usePersonalInfoForm();
    const [preview, setPreview] = useState<string | null>(initialImageUrl ?? null);
    const [storedUrl, setStoredUrl] = useState<string | null>(initialImageUrl ?? null);
    const [status, setStatus] = useState<UploadStatus>("idle");

    useEffect(() => {
        if (initialImageUrl) {
            setPreview(initialImageUrl);
            setStoredUrl(initialImageUrl);
        }
    }, [initialImageUrl]);

    const uploadFile = async (file: File) => {
        setStatus("uploading");

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        try {
            const formData = new FormData();
            formData.append("avatar", file);
            if (storedUrl) formData.append("oldUrl", storedUrl);

            const res = await fetch("/api/upload", {
                method: storedUrl ? "PATCH" : "POST",
                body: formData,
            });

            if (!res.ok) {
                const { error } = await res.json().catch(() => ({ error: "Upload failed" }));
                throw new Error(error || "Upload failed");
            }

            const { url } = await res.json();
            await authClient.updateUser({ image: url });

            setPreview(url);
            setStoredUrl(url);
            setStatus("idle");
            successAlert("Photo updated");
        } catch (err) {
            setStatus("idle");
            setPreview(storedUrl);
            errorAlert(err instanceof Error ? err.message : "Something went wrong");
        }
    };

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
        if (fileRejections.length > 0) {
            const reason = fileRejections[0].errors[0]?.message;
            errorAlert(reason || "Invalid file");
            return;
        }
        const file = acceptedFiles[0];
        if (file) uploadFile(file);
    }, [storedUrl]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
        maxSize: MAX_SIZE,
        maxFiles: 1,
        multiple: false,
        disabled: status === "uploading",
    });

    return (
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-5 mb-8 pb-8 border-b border-gray-100 md:border-b-0 md:mb-0 md:pb-0">
                <div
                    {...getRootProps()}
                    className={`relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors shrink-0 ${isDragActive
                        ? "border-[#07c4ec] bg-cyan-50"
                        : "border-gray-300 hover:border-[#07c4ec]/60 bg-gray-50"
                        } ${status === "uploading" ? "opacity-70 cursor-wait" : ""}`}
                >
                    <input {...getInputProps()} />

                    {preview ? (
                        <img
                            src={preview}
                            alt="Profile preview"
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <UserRound className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-300" />
                    )}

                    {status === "uploading" && (
                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                    )}

                    {status !== "uploading" && (
                        <div className="absolute cursor-pointer bottom-1 right-1 sm:bottom-2 sm:right-2 md:bottom-3 md:right-3 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#07c4ec] rounded-full flex items-center justify-center border-2 border-white">
                            <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                        </div>
                    )}
                </div>

                <div className="min-w-0">
                    <p className="text-xl sm:text-2xl text-center md:text-start md:text-3xl font-semibold text-gray-800 truncate">
                        {session?.user?.name ?? ""}
                    </p>
                    <p className="text-base sm:text-lg md:text-xl text-center md:text-start font-medium text-gray-600">
                        {initialValues.jobTitle || "No job title"}
                    </p>
                    <div className="flex items-center mt-1 gap-1 min-w-0">
                        <AtSign className="text-xs text-gray-500 w-4 h-4 shrink-0" />
                        <p className="text-sm text-gray-500 truncate">{session?.user?.email ?? ""}</p>
                    </div>
                    <div className="flex items-start gap-1 min-w-0 mt-1">
                        <MapPin className="text-xs text-gray-500 w-4 h-4 shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-500 break-words">
                            {initialValues.address || "No address"}
                        </p>
                    </div>

                    {status === "uploading" && (
                        <p className="text-xs text-[#07c4ec] mt-0.5">Uploading…</p>
                    )}
                </div>
            </div>

            <div className="w-full sm:w-60 md:w-64 lg:w-72 shrink-0 border-2 border-dashed border-gray-300 rounded-xl p-3 text-center text-sm text-gray-500 hover:border-[#07c4ec]/60 transition-colors cursor-pointer">
                Drop your CV here
            </div>
        </div>
    );
}