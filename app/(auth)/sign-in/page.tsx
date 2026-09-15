"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@public/logo/logo.png";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Typography, Alert } from "@mui/material";
import { TextFormField, PasswordField } from "@/src/components/common/AppFormField";
import IllustrationPanel from "@/src/components/website/IllustrationPanel";
import { LoginValues } from "@/src/features/auth/type";
import useAuth from "@/src/hooks/useAuth";
import AppButton from "@/src/components/common/AppButton";

import { Suspense } from "react";

const initialValues: LoginValues = { email: "", password: "" };

const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
});

function LoginForm() {
    const { handleSubmitLogin, authError } = useAuth();

    return (
        <>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 text-center">
                Welcome Back
            </h1>
            <p className="text-sm text-gray-500 mb-8 text-center">
                Sign in to continue your career journey.
            </p>

            {authError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: "8px" }}>
                    {authError}
                </Alert>
            )}

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmitLogin}
            >
                {({ isSubmitting }) => (
                    <Form noValidate className="flex flex-col gap-6">
                        <TextFormField
                            name="email"
                            label="Email address"
                            type="email"
                            placeholder="Enter your email address"
                            autoComplete="email"
                            id="login-email"
                        />

                        <PasswordField
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            id="login-password"
                        />

                        <div className="flex items-center justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-[#07c4ec] font-semibold hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        <AppButton
                            type="submit"
                            loading={isSubmitting}
                            loadingText="Signing in..."
                        >
                            Sign In
                        </AppButton>
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ color: "#6b7280", mt: 1 }}
                        >
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/sign-up"
                                className="text-green-600 font-semibold hover:underline"
                            >
                                Create one
                            </Link>
                        </Typography>
                    </Form>
                )}
            </Formik>
        </>
    );
}

export default function SignInPage() {
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
                        <LoginForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}