"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AtSign, Camera, Loader2, MapPin, UserRound } from "lucide-react";

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
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 w-full">
                <div className="flex flex-col sm:flex-row items-center gap-5 mb-8 pb-8 border-b border-gray-100 md:border-b-0 md:mb-0 md:pb-0">
                    <div
                        {...getRootProps()}
                        className={`relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors shrink-0 ${isDragActive
                            ? "border-[#07c4ec] bg-cyan-50"
                            : "border-gray-300 hover:border-[#07c4ec]/60 bg-gray-50"
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
                            <div className="absolute cursor-pointer bottom-1 right-1 sm:bottom-2 sm:right-2 md:bottom-3 md:right-3 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-[#07c4ec] rounded-full flex items-center justify-center border-2 border-white">
                                <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="text-xl sm:text-2xl text-center md:text-start md:text-3xl font-semibold text-gray-800 truncate">
                            {user?.name ?? ""}
                        </p>
                        <p className="text-base sm:text-lg md:text-xl text-center md:text-start font-medium text-gray-600">
                            {jobTitle || "No job title"}
                        </p>
                        <div className="flex items-center mt-1 gap-1 min-w-0">
                            <AtSign className="text-xs text-gray-500 w-4 h-4 shrink-0" />
                            <p className="text-sm text-gray-500 truncate">
                                {user?.email ?? ""}
                            </p>
                        </div>
                        <div className="flex items-start gap-1 min-w-0 mt-1">
                            <MapPin className="text-xs text-gray-500 w-4 h-4 shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-500 break-words">
                                {current?.address || "No address"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full sm:w-40 md:w-64 lg:w-72 shrink-0 text-center text-sm text-gray-500 transition-colors cursor-pointer">
                    <button className="border-dashed border-gray-300 border-2 rounded-xl p-3 hover:border-[#07c4ec]/60">
                        Drop your CV here
                    </button>
                </div>
            </div>
        </>
    );
}