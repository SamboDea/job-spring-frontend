"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Logo from "@public/logo/logo.png";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Typography, Alert, CircularProgress } from "@mui/material";
import FormikPasswordField from "@/src/components/form/FormikPasswordField";
import { confirmPasswordReset } from "@/src/lib/auth-client";
import IllustrationPanel from "@/src/components/layout/website/IllustrationPanel";

interface ResetPasswordValues {
    password: string;
    confirmPassword: string;
}

const initialValues: ResetPasswordValues = { password: "", confirmPassword: "" };

const validationSchema = Yup.object({
    password: Yup.string().min(8, "Must be at least 8 characters").required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
});

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [authError, setAuthError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    const handleSubmit = async (
        values: ResetPasswordValues,
        { setSubmitting }: { setSubmitting: (v: boolean) => void }
    ) => {
        setAuthError(null);

        if (!token) {
            setAuthError("This link is invalid or has expired.");
            setSubmitting(false);
            return;
        }

        const { error } = await confirmPasswordReset({
            newPassword: values.password,
            token,
        });

        if (error) {
            setAuthError(error.message ?? "This link is invalid or has expired.");
            setSubmitting(false);
            return;
        }

        setDone(true);
    };

    if (!token) {
        return (
            <>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 text-center">
                    Invalid or expired link
                </h1>
                <p className="text-sm text-gray-500 mb-8 text-center">
                    This password reset link is missing or no longer valid.
                </p>
                <div className="text-center">
                    <Link href="/forgot-password" className="text-sm text-[#07c4ec] font-semibold hover:underline">
                        Request a new link
                    </Link>
                </div>
            </>
        );
    }

    if (done) {
        return (
            <>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 text-center">
                    Password updated
                </h1>
                <p className="text-sm text-gray-500 mb-8 text-center">
                    Your password has been reset successfully. You can now log in.
                </p>
                <div className="flex justify-center">
                    <Link href="/login">
                        <Button
                            variant="contained"
                            sx={{
                                height: 46,
                                px: 4,
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
                            }}
                        >
                            Go to login
                        </Button>
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 text-center">
                Set a new password
            </h1>
            <p className="text-sm text-gray-500 mb-8 text-center">
                Choose a strong new password for your account.
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
                        <FormikPasswordField
                            name="password"
                            label="New password"
                            placeholder="Enter your new password"
                            autoComplete="new-password"
                            id="reset-password-password"
                        />

                        <FormikPasswordField
                            name="confirmPassword"
                            label="Confirm new password"
                            placeholder="Confirm your new password"
                            autoComplete="new-password"
                            id="reset-password-confirm"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isSubmitting}
                            id="reset-password-submit"
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
                                    Updating…
                                </span>
                            ) : (
                                "Reset password"
                            )}
                        </Button>

                        <Typography variant="body2" align="center" sx={{ color: "#6b7280", mt: 1 }}>
                            Remembered it?{" "}
                            <Link href="/login" className="text-green-600 font-semibold hover:underline">
                                Back to login
                            </Link>
                        </Typography>
                    </Form>
                )}
            </Formik>
        </>
    );
}

export default function ResetPasswordPage() {
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

                    <Suspense fallback={<div className="text-center text-sm text-gray-400">Loading…</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}