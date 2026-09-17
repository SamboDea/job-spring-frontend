// app/(auth)/reset-password/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@public/logo/logo.png";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Typography, Alert } from "@mui/material";
import { TextFormField } from "@/src/components/common/AppFormField";
import { resetPassword } from "@/src/lib/auth-client";
import IllustrationPanel from "@/src/components/website/IllustrationPanel";
import AppButton from "@/src/components/common/AppButton";
import { ResetPasswordValues } from "@/src/features/auth/type";

const initialValues: ResetPasswordValues = { newPassword: "", confirmPassword: "" };

const validationSchema = Yup.object({
    newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("New password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Please confirm your password"),
});

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [done, setDone] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const handleSubmit = async (
        values: ResetPasswordValues,
        { setSubmitting }: { setSubmitting: (v: boolean) => void }
    ) => {
        setAuthError(null);

        if (!token) {
            setAuthError("This reset link is invalid or has expired.");
            setSubmitting(false);
            return;
        }

        try {
            const { error } = await resetPassword({
                newPassword: values.newPassword,
                token,
            });

            if (error) {
                setAuthError(error.message ?? "This reset link is invalid or has expired.");
                setSubmitting(false);
                return;
            }

            setDone(true);
            setTimeout(() => router.push("/sign-in"), 2500);
        } catch {
            setAuthError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Back to Home */}
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

                    {!token ? (
                        <>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 text-center">
                                Invalid reset link
                            </h1>
                            <p className="text-sm text-gray-500 mb-8 text-center">
                                This password reset link is missing or has expired. Please request a new one.
                            </p>
                            <div className="text-center">
                                <Link href="/forgot-password" className="text-sm text-[#07c4ec] font-semibold hover:underline">
                                    Request a new link
                                </Link>
                            </div>
                        </>
                    ) : done ? (
                        <>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 text-center">
                                Password reset
                            </h1>
                            <p className="text-sm text-gray-500 mb-8 text-center">
                                Your password has been updated. Redirecting you to sign in…
                            </p>
                            <div className="text-center">
                                <Link href="/sign-in" className="text-sm text-[#07c4ec] font-semibold hover:underline">
                                    Back to login
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 text-center">
                                Reset your password
                            </h1>
                            <p className="text-sm text-gray-500 mb-8 text-center">
                                Enter a new password for your account.
                            </p>

                            {authError && (
                                <Alert severity="error" sx={{ mb: 3, borderRadius: "8px" }}>
                                    {authError}
                                </Alert>
                            )}

                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form noValidate className="flex flex-col gap-6">
                                        <TextFormField
                                            name="newPassword"
                                            label="New password"
                                            type="password"
                                            placeholder="Enter your new password"
                                            autoComplete="new-password"
                                            id="reset-password-new"
                                        />

                                        <TextFormField
                                            name="confirmPassword"
                                            label="Confirm password"
                                            type="password"
                                            placeholder="Re-enter your new password"
                                            autoComplete="new-password"
                                            id="reset-password-confirm"
                                        />

                                        <AppButton
                                            type="submit"
                                            disabled={isSubmitting}
                                            loading={isSubmitting}
                                            loadingText="Resetting…"
                                            id="reset-password-submit"
                                        >
                                            Reset password
                                        </AppButton>

                                        <Typography variant="body2" align="center" sx={{ color: "#6b7280", mt: 1 }}>
                                            Remembered it?{" "}
                                            <Link href="/sign-in" className="text-green-600 font-semibold hover:underline">
                                                Back to login
                                            </Link>
                                        </Typography>
                                    </Form>
                                )}
                            </Formik>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordForm />
        </Suspense>
    );
}