"use client";

import { authClient } from "@/src/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import Logo from "@public/logo/logo.png";
import IllustrationPanel from "@/src/components/layout/website/IllustrationPanel";
import { Alert, CircularProgress } from "@mui/material";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";

    const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [verified, setVerified] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const hasSentRef = useRef(false);

    // Auto-focus the first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    // Cooldown timer for resend button
    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [email]);

    const handleDigitChange = (index: number, value: string) => {
        // Only allow single digit
        const digit = value.replace(/\D/g, "").slice(-1);
        const newDigits = [...digits];
        newDigits[index] = digit;
        setDigits(newDigits);
        setError("");

        // Auto-advance to next input
        if (digit && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            // Move back on backspace if current box is empty
            const newDigits = [...digits];
            newDigits[index - 1] = "";
            setDigits(newDigits);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;
        const newDigits = Array(OTP_LENGTH).fill("");
        for (let i = 0; i < pasted.length; i++) {
            newDigits[i] = pasted[i];
        }
        setDigits(newDigits);
        // Focus the next empty box or the last one
        const nextEmpty = newDigits.findIndex((d) => !d);
        inputRefs.current[nextEmpty >= 0 ? nextEmpty : OTP_LENGTH - 1]?.focus();
    };

    const otp = digits.join("");

    const handleVerify = useCallback(async () => {
        if (otp.length !== OTP_LENGTH) return;
        setError("");
        setLoading(true);

        const { error } = await authClient.emailOtp.verifyEmail({
            email,
            otp,
        });

        if (error) {
            setLoading(false);
            setError(error.message ?? "Invalid or expired code");
            // Clear all digits so user can re-enter
            setDigits(Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
            return;
        }

        // Show success state briefly before redirect
        setLoading(false);
        setVerified(true);
        setTimeout(() => {
            router.push("/login");
        }, 1200);
    }, [email, otp, router]);

    // Auto-submit when all 6 digits are entered
    useEffect(() => {
        if (otp.length === OTP_LENGTH && !loading && !verified) {
            handleVerify();
        }
    }, [otp, loading, verified, handleVerify]);

    const handleResend = async () => {
        setResending(true);
        setError("");
        try {
            await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "email-verification",
            });
            setCooldown(RESEND_COOLDOWN);
        } catch {
            setError("Failed to resend code. Please try again.");
        }
        setResending(false);
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Illustration */}
            <IllustrationPanel />

            {/* Right Form Panel */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 min-h-screen">
                <div className="w-full max-w-md p-8 sm:p-10" style={{ animation: "authFadeIn 0.5s ease-out" }}>
                    {/* Logo */}
                    <div className="flex mb-8 justify-center">
                        <Image src={Logo} alt="JobSpring Logo" width={200} height={34} priority />
                    </div>

                    {verified ? (
                        /* ── Success State ── */
                        <div className="text-center" style={{ animation: "authFadeIn 0.4s ease-out" }}>
                            <div
                                className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-full"
                                style={{ backgroundColor: "rgba(113, 221, 55, 0.1)" }}
                            >
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#71dd37" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-2">
                                Email Verified!
                            </h1>
                            <p className="text-sm text-gray-500">
                                Redirecting you to get started…
                            </p>
                        </div>
                    ) : (
                        /* ── Verify Form ── */
                        <>
                            <div className="text-center mb-2">
                                <div
                                    className="mx-auto mb-4 flex items-center justify-center w-14 h-14 rounded-full"
                                    style={{ backgroundColor: "rgba(7, 196, 236, 0.08)" }}
                                >
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#07c4ec" strokeWidth={1.8}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1">
                                    Verify your email
                                </h1>
                                <p className="text-sm text-gray-500 mb-1">
                                    Enter the 6-digit code sent to
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {email}
                                </p>
                            </div>

                            {/* Error alert */}
                            {error && (
                                <Alert severity="error" sx={{ mb: 2, mt: 2, borderRadius: "8px" }}>
                                    {error}
                                </Alert>
                            )}

                            {/* OTP Digit Boxes */}
                            <div className="flex justify-center gap-3 mt-6 mb-6" onPaste={handlePaste}>
                                {digits.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={(el) => { inputRefs.current[i] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleDigitChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        disabled={loading}
                                        aria-label={`Digit ${i + 1}`}
                                        className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 focus:outline-none disabled:opacity-50"
                                        style={{
                                            borderColor: digit ? "#71dd37" : "#e5e7eb",
                                            boxShadow: digit ? "0 0 0 3px rgba(113, 221, 55, 0.1)" : "none",
                                            color: "#1f2937",
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = "#07c4ec";
                                            e.target.style.boxShadow = "0 0 0 3px rgba(7, 196, 236, 0.15)";
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = digit ? "#71dd37" : "#e5e7eb";
                                            e.target.style.boxShadow = digit ? "0 0 0 3px rgba(113, 221, 55, 0.1)" : "none";
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Verify Button */}
                            <button
                                onClick={handleVerify}
                                disabled={loading || otp.length !== OTP_LENGTH}
                                className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                style={{
                                    backgroundColor: "#71dd37",
                                    boxShadow: "0 4px 12px rgba(113, 221, 55, 0.2)",
                                }}
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress size={18} sx={{ color: "white" }} />
                                        Verifying…
                                    </>
                                ) : (
                                    "Verify Email"
                                )}
                            </button>

                            {/* Resend */}
                            <div className="text-center mt-5">
                                <p className="text-sm text-gray-400 mb-2">Didn&apos;t receive the code?</p>
                                <button
                                    onClick={handleResend}
                                    disabled={resending || cooldown > 0}
                                    className="text-sm font-semibold transition-colors duration-200 disabled:opacity-50"
                                    style={{ color: "#07c4ec" }}
                                >
                                    {resending
                                        ? "Sending…"
                                        : cooldown > 0
                                            ? `Resend code in ${cooldown}s`
                                            : "Resend code"
                                    }
                                </button>
                            </div>
                        </>
                    )}
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