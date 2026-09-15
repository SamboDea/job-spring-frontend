"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Logo from "@public/logo/logo.png";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Typography, Alert } from "@mui/material";
import { PasswordField } from "@/src/components/common/AppFormField";
import { changePassword, useSession } from "@/src/lib/auth-client";
import IllustrationPanel from "@/src/components/website/IllustrationPanel";
import AppButton from "@/src/components/common/AppButton";
import { ChangePasswordValues } from "@/src/features/auth/type";

const initialValues: ChangePasswordValues = {
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
};

const validationSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
        .min(8, "Must be at least 8 characters")
        .required("New password is required")
        .notOneOf([Yup.ref("currentPassword")], "New password must be different from current password"),
    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Please confirm your new password"),
});

function ChangePasswordForm() {
    const router = useRouter();
    const [authError, setAuthError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    const handleSubmit = async (
        values: ChangePasswordValues,
        { setSubmitting, resetForm }: { setSubmitting: (v: boolean) => void; resetForm: () => void }
    ) => {
        setAuthError(null);

        const { error } = await changePassword({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
            revokeOtherSessions: true,
        });

        if (error) {
            setAuthError(error.message ?? "Could not update your password. Please try again.");
            setSubmitting(false);
            return;
        }

        resetForm();
        setDone(true);
        setSubmitting(false);
    };

    if (done) {
        return (
            <>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 text-center">
                    Password updated
                </h1>
                <p className="text-sm text-gray-500 mb-8 text-center">
                    Your password has been changed. Your other active sessions have been signed out.
                </p>
                <div className="flex justify-center">
                    <AppButton onClick={() => router.push("/dashboard")}>
                        Back to dashboard
                    </AppButton>
                </div>
            </>
        );
    }

    return (
        <>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 text-center">
                Change your password
            </h1>
            <p className="text-sm text-gray-500 mb-8 text-center">
                Enter your current password and choose a new one.
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
                        <PasswordField
                            name="currentPassword"
                            label="Current password"
                            placeholder="Enter your current password"
                            autoComplete="current-password"
                            id="change-password-current"
                        />

                        <PasswordField
                            name="newPassword"
                            label="New password"
                            placeholder="Enter your new password"
                            autoComplete="new-password"
                            id="change-password-new"
                        />

                        <PasswordField
                            name="confirmNewPassword"
                            label="Confirm new password"
                            placeholder="Confirm your new password"
                            autoComplete="new-password"
                            id="change-password-confirm"
                        />

                        <AppButton
                            type="submit"
                            loading={isSubmitting}
                            loadingText="Updating…"
                        >
                            Change password
                        </AppButton>

                        <Typography variant="body2" align="center" sx={{ color: "#6b7280", mt: 1 }}>
                            <Link href="/dashboard" className="text-green-600 font-semibold hover:underline">
                                Back to dashboard
                            </Link>
                        </Typography>
                    </Form>
                )}
            </Formik>
        </>
    );
}

export default function ChangePassword() {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    if (!isPending && !session) {
        router.replace("/login");
        return null;
    }

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

                    {isPending ? (
                        <div className="text-center text-sm text-gray-400">Loading…</div>
                    ) : (
                        <ChangePasswordForm />
                    )}
                </div>
            </div>
        </div>
    );
}