"use client";

import { sendVerificationEmail } from "@/src/lib/auth-client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@public/logo/logo.png";
import IllustrationPanel from "@/src/components/website/IllustrationPanel";
import { Alert, CircularProgress } from "@mui/material";
import AppButton from "@/src/components/common/AppButton";

const RESEND_COOLDOWN = 30;

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const rawEmail = searchParams.get("email") ?? "";
    const email = rawEmail.trim().toLowerCase();

    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleResend = async () => {
        if (!email) {
            setStatusMessage({ type: "error", text: "No email address found to resend to." });
            return;
        }

        setResending(true);
        setStatusMessage(null);

        try {
            const { error } = await sendVerificationEmail({
                email,
                callbackURL: "/dashboard",
            });

            if (error) {
                setStatusMessage({ type: "error", text: error.message ?? "Failed to resend verification email." });
            } else {
                setStatusMessage({ type: "success", text: "A fresh verification link has been sent to your email!" });
                setCooldown(RESEND_COOLDOWN);
            }
        } catch {
            setStatusMessage({ type: "error", text: "An error occurred while resending the email." });
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">

            <Link
                href="/home"
                className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-200"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to Home
            </Link>

            <IllustrationPanel />

            <div className="flex flex-col justify-center items-center w-full md:w-1/2 min-h-screen">
                <div className="w-full max-w-md p-8 sm:p-10" style={{ animation: "authFadeIn 0.5s ease-out" }}>
                    <div className="flex mb-8 justify-center">
                        <Image src={Logo} alt="JobSpring Logo" width={200} height={34} priority />
                    </div>

                    <div className="text-center mb-6">
                        <div
                            className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full"
                            style={{ backgroundColor: "rgba(7, 196, 236, 0.1)" }}
                        >
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#07c4ec" strokeWidth={1.8}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
                            Check your email
                        </h1>
                        <p className="text-sm text-gray-500 mb-1">
                            We have sent a verification link to:
                        </p>
                        <p className="text-sm font-semibold text-gray-800 mb-4">
                            {email || "your email address"}
                        </p>
                        <p className="text-sm text-gray-500">
                            Click the link in the email to verify your account and sign in.
                        </p>
                    </div>

                    {statusMessage && (
                        <Alert
                            severity={statusMessage.type}
                            sx={{ mb: 3, borderRadius: "8px" }}
                        >
                            {statusMessage.text}
                        </Alert>
                    )}

                    <div className="flex flex-col gap-4">
                        <AppButton
                            onClick={handleResend}
                            disabled={resending || cooldown > 0}
                            loading={resending}
                            loadingText="Sending…"
                        >
                            {cooldown > 0 ? `Resend link in ${cooldown}s` : "Resend verification email"}
                        </AppButton>

                        <div className="text-center mt-2">
                            <Link
                                href="/sign-in"
                                className="text-sm text-green-600 font-semibold hover:underline"
                            >
                                Back to login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <CircularProgress sx={{ color: "#07c4ec" }} />
                </div>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    );
}