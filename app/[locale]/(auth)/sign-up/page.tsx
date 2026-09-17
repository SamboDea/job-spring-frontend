"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo/logo.png";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Typography, Alert, MenuItem } from "@mui/material";

import {
    TextFormField,
    PasswordField,
    PasswordStrength,
} from "@/src/components/common/AppFormField";

import IllustrationPanel from "@/src/components/website/IllustrationPanel";
import useAuth from "@/src/hooks/useAuth";
import { RegisterValues } from "@/src/features/auth/type";
import AppButton from "@/src/components/common/AppButton";

const initialValues: RegisterValues = {
    name: "",
    email: "",
    password: "",
    role: "candidate",
};

const validationSchema = Yup.object({
    name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Full name is required"),

    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),

    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),

    role: Yup.string()
        .oneOf(
            ["candidate", "company"],
            "Please select a valid account type."
        )
        .required("Account type is required"),
});

export default function SignUpPage() {
    const { authError, signUp } = useAuth();

    const handleSubmit = async (
        values: RegisterValues,
        {
            setSubmitting,
        }: {
            setSubmitting: (v: boolean) => void;
        }
    ) => {
        await signUp(values, setSubmitting);
    };

    return (
        <div className="min-h-screen flex bg-white">
            <Link
                href="/home"
                className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-200"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                    />
                </svg>

                Back to Home
            </Link>
            <IllustrationPanel />
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 min-h-screen">
                <div
                    className="w-full max-w-md p-8 sm:p-10"
                    style={{
                        animation: "authFadeIn 0.5s ease-out",
                    }}
                >
                    <div className="flex mb-8 justify-center">
                        <Image
                            src={Logo}
                            alt="JobSpring Logo"
                            width={200}
                            height={34}
                            priority
                        />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-1 text-center">
                        Create your account
                    </h1>

                    <p className="text-sm text-gray-500 mb-8 text-center">
                        Join JobSpring and start your career journey today.
                    </p>
                    {authError && (
                        <Alert
                            severity="error"
                            sx={{
                                mb: 3,
                                borderRadius: "8px",
                            }}
                        >
                            {authError}
                        </Alert>
                    )}

                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting, values }) => (
                            <Form
                                noValidate
                                className="flex flex-col gap-7"
                            >
                                <TextFormField
                                    name="name"
                                    label="Full name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    id="register-name"
                                />

                                <TextFormField
                                    name="email"
                                    label="Email address"
                                    type="email"
                                    placeholder="Enter your email address"
                                    autoComplete="email"
                                    id="register-email"
                                />

                                <TextFormField
                                    name="role"
                                    label="Account type"
                                    select
                                    id="register-role"
                                >
                                    <MenuItem value="candidate">
                                        Candidate
                                    </MenuItem>

                                    <MenuItem value="company">
                                        Company
                                    </MenuItem>
                                </TextFormField>
                                <PasswordField
                                    name="password"
                                    label="Password"
                                    placeholder="Create a strong password"
                                    autoComplete="new-password"
                                    id="register-password"
                                />

                                {/* Password Strength */}
                                {/* <PasswordStrength password={values.password} /> */}

                                {/* Submit */}
                                <AppButton
                                    type="submit"
                                    loading={isSubmitting}
                                    loadingText="Creating account..."
                                >
                                    Sign Up
                                </AppButton>

                                {/* Login */}
                                <Typography
                                    variant="body2"
                                    align="center"
                                    sx={{
                                        color: "#6b7280",
                                    }}
                                >
                                    Already have an account?{" "}
                                    <Link
                                        href="/sign-in"
                                        className="text-green-600 font-semibold hover:underline"
                                    >
                                        Sign in
                                    </Link>
                                </Typography>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}
