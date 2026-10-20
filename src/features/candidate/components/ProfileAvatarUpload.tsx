"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AtSign, Camera, FileText, FileUp, Loader2, MapPin, UserRound } from "lucide-react";

import { authClient } from "@/src/lib/auth-client";
import useCandidate from "@/src/features/candidate/useCandidate";
import useUser from "@/src/features/users/useUser";

import Image from "next/image";
import Swal from "sweetalert2";
import useWorkExperience from "../work-experience/useWorkExperience";
import LoadingOverlay from "@/src/components/common/LoadingOverlay";

const MAX_SIZE = 5 * 1024 * 1024;

export default function ProfileAvatarUpload() {
    const { user, avatarUploading, uploadAvatar, handleUpdateProfile } = useUser();
    const { current } = useCandidate();
    const { list } = useWorkExperience();

    const jobTitle = list[0]?.jobTitle;
    const imageUrl = user?.image;

    const onDrop = useCallback(
        async (acceptedFiles: File[], fileRejections: any[]) => {
            if (fileRejections.length > 0) {
                const reason = fileRejections[0]?.errors?.[0]?.message;
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: reason || "Invalid image",
                    timer: 3000,
                    showConfirmButton: false,
                });
                return;
            }

            const file = acceptedFiles[0];
            if (!file) return;

            try {
                const url = await uploadAvatar(file);
                await authClient.updateUser({ image: url });

                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Photo updated successfully",
                    timer: 3000,
                    showConfirmButton: false,
                });
            } catch (error) {
                console.error("Avatar upload failed:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to upload photo",
                    timer: 3000,
                    showConfirmButton: false,
                });
            }
        },
        [uploadAvatar]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [],
            "image/png": [],
            "image/webp": [],
        },
        maxSize: MAX_SIZE,
        maxFiles: 1,
        multiple: false,
        disabled: avatarUploading,
    });

    return (
        <>
            <LoadingOverlay show={avatarUploading} />
            <div className="w-full overflow-hidden bg-white">
                <div className="p-2">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        {/* Avatar + info */}
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 min-w-0">
                            <div
                                {...getRootProps()}
                                className={`relative mx-auto md:mx-0 w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-md flex items-center justify-center cursor-pointer transition-all shrink-0 ${isDragActive
                                    ? "ring-4 ring-[#07c4ec]/40 bg-cyan-50"
                                    : "bg-gray-50 hover:ring-4 hover:ring-[#07c4ec]/20"
                                    } ${avatarUploading ? "opacity-70 cursor-wait" : ""}`}
                            >
                                <input {...getInputProps()} />

                                {imageUrl ? (
                                    <Image
                                        key={imageUrl}
                                        src={imageUrl}
                                        alt="Profile preview"
                                        className="w-full h-full rounded-full object-cover"
                                        width={512}
                                        height={512}
                                    />
                                ) : (
                                    <UserRound className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-300" />
                                )}

                                {avatarUploading && (
                                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    </div>
                                )}

                                {!avatarUploading && (
                                    <div className="absolute cursor-pointer bottom-0 right-0 sm:bottom-1 sm:right-1 w-7 h-7 md:w-8 md:h-8 bg-[#696CFF] rounded-full flex items-center justify-center border-2 border-white">
                                        <Camera className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 text-center md:text-start">
                                <p className="text-2xl md:text-3xl font-semibold text-gray-800 truncate">
                                    {user?.name ?? ""}
                                </p>
                                <p className="text-base md:text-lg font-medium text-gray-600">
                                    {jobTitle || "No job title"}
                                </p>

                                <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                                    <span className="inline-flex items-center gap-1.5 max-w-full rounded-xl bg-gray-50 px-3 py-1.5 text-sm text-gray-600">
                                        <AtSign className="w-4 h-4 shrink-0 text-gray-500" />
                                        <span className="truncate">{user?.email ?? ""}</span>
                                    </span>
                                    <span className="inline-flex items-start gap-1.5 max-w-full rounded-xl bg-gray-50 px-3 py-1.5 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-500" />
                                        <span className="break-words text-start">
                                            {current?.address || "No address"}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* CV drop area: right side, same row as the avatar */}
                        <div className="flex w-full md:w-auto shrink-0 gap-2">
                            <button
                                type="button"
                                className="cursor-pointer flex w-full md:w-auto items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-5 py-3 text-sm text-gray-500 transition-colors hover:border-[#07c4ec]/60 hover:text-[#07c4ec]"
                            >
                                <FileUp className="w-5 h-5" />
                                Drop your CV here
                            </button>

                            <button
                                type="button"
                                className="cursor-pointer flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-[#696CFF] px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <FileText className="w-5 h-5" />
                                Generate CV
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}