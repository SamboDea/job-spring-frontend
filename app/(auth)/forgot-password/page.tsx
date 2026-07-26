"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@public/logo/logo.png";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, Alert, CircularProgress } from "@mui/material";
import FormikTextField from "@/src/components/form/FormikTextField";
import { requestPasswordReset } from "@/src/lib/auth-client";
import { useState } from "react";
import IllustrationPanel from "@/src/components/layout/website/IllustrationPanel";

interface ForgotPasswordValues {
    email: string;
}

const initialValues: ForgotPasswordValues = { email: "" };

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
});

export default function ForgotPasswordPage() {
    const [sent, setSent] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const handleSubmit = async (
        values: ForgotPasswordValues,
        { setSubmitting }: { setSubmitting: (v: boolean) => void }
    ) => {
        setAuthError(null);
        try {
            await requestPasswordReset({
                email: values.email,
                redirectTo: "/reset-password",
            });
            // Always show success state, even on failure, to avoid leaking
            // which emails are registered
            setSent(true);
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

            {/* Left Illustration */}
            <IllustrationPanel />

            {/* Right Form Panel */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 min-h-screen">
                <div className="w-full max-w-md p-8 sm:p-10" style={{ animation: "authFadeIn 0.5s ease-out" }}>
                    {/* Logo */}
                    <div className="flex mb-8 justify-center">
                        <Image src={Logo} alt="JobSpring Logo" width={200} height={34} priority />
                    </div>

                    {sent ? (
                        <>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 text-center">
                                Check your email
                            </h1>
                            <p className="text-sm text-gray-500 mb-8 text-center">
                                If an account exists for that email, we&apos;ve sent a link to reset your password.
                            </p>
                            <div className="text-center">
                                <Link href="/login" className="text-sm text-[#07c4ec] font-semibold hover:underline">
                                    Back to login
                                </Link>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Heading */}
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 text-center">
                                Forgot your password?
                            </h1>
                            <p className="text-sm text-gray-500 mb-8 text-center">
                                Enter your email and we&apos;ll send you a reset link.
                            </p>

                            {/* Error alert */}
                            {authError && (
                                <Alert severity="error" sx={{ mb: 3, borderRadius: "8px" }}>
                                    {authError}
                                </Alert>
                            )}

                            {/* Form */}
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form noValidate className="flex flex-col gap-6">
                                        <FormikTextField
                                            name="email"
                                            label="Email address"
                                            type="email"
                                            placeholder="Enter your email address"
                                            autoComplete="email"
                                            id="forgot-password-email"
                                        />

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            fullWidth
                                            disabled={isSubmitting}
                                            id="forgot-password-submit"
                                            sx={{
                                                height: 46,
                                                borderRadius: "8px",
                                                textTransform: "none",
                                                fontWeight: 600,
                                                fontSize: "0.95rem",
                                                backgroundColor: "#71dd37",
                                                boxShadow: "0 4px 12px rgba(113, 221, 55, 0.2)",
                                                "&:hover": {
                                                    backgroundColor: "#6ce729ff",
                                                    boxShadow: "0 6px 16px rgba(113, 221, 55, 0.3)",
                                                },
                                                "&.Mui-disabled": { opacity: 0.6 },
                                            }}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <CircularProgress size={18} sx={{ color: "white" }} />
                                                    Sending…
                                                </span>
                                            ) : (
                                                "Send reset link"
                                            )}
                                        </Button>

                                        <Typography
                                            variant="body2"
                                            align="center"
                                            sx={{ color: "#6b7280", mt: 1 }}
                                        >
                                            Remembered it?{" "}
                                            <Link
                                                href="/login"
                                                className="text-green-600 font-semibold hover:underline"
                                            >
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