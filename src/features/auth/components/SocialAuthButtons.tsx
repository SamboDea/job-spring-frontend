"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import Loading from "@/src/components/common/AppLoading";

interface SocialAuthButtonsProps {
    onSocialLogin: (provider: "google" | "github") => void;
    loadingProvider: "google" | "github" | null;
    disabled?: boolean;
}

export default function SocialAuthButtons({
    onSocialLogin,
    loadingProvider,
    disabled = false,
}: SocialAuthButtonsProps) {
    const isGoogleLoading = loadingProvider === "google";
    const isGithubLoading = loadingProvider === "github";
    const isAnyLoading = Boolean(loadingProvider) || disabled;

    return (
        <div className="w-full">
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => onSocialLogin("google")}
                    disabled={isAnyLoading}
                    aria-label="Continue with Google"
                    className="relative flex items-center justify-center gap-2.5 px-4 py-2.5 h-11 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium text-sm transition-all duration-200 shadow-xs hover:border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                    {isGoogleLoading ? (
                        <Loading size="sm" color="#4285F4" />
                    ) : (
                        <FcGoogle className="w-5 h-5 shrink-0" />
                    )}
                    <span className="truncate">Google</span>
                </button>

                <button
                    type="button"
                    onClick={() => onSocialLogin("github")}
                    disabled={isAnyLoading}
                    aria-label="Continue with GitHub"
                    className="relative flex items-center justify-center gap-2.5 px-4 py-2.5 h-11 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 font-medium text-sm transition-all duration-200 shadow-xs hover:border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                    {isGithubLoading ? (
                        <Loading size="sm" color="#24292F" />
                    ) : (
                        <FaGithub className="w-5 h-5 shrink-0 text-gray-900" />
                    )}
                    <span className="truncate">GitHub</span>
                </button>
            </div>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-gray-400 font-medium tracking-wider">
                        Or continue with email
                    </span>
                </div>
            </div>
        </div>
    );
}
