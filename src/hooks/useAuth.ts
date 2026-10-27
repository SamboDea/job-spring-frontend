import { useRef, useState } from "react";
import { signUpAction } from "@/src/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/src/lib/auth-client";
import { LoginValues } from "@/src/features/auth/type";

interface SignUpValues {
    name: string;
    email: string;
    password: string;
}

export default function useAuth() {
    const [authError, setAuthError] = useState<string | null>(null);
    const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);
    const isSubmittingRef = useRef(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryRedirect = searchParams.get("redirectTo");
    const urlError = searchParams.get("error");

    const signUp = async (
        values: SignUpValues,
        setSubmitting: (v: boolean) => void
    ) => {
        if (isSubmittingRef.current) return;
        isSubmittingRef.current = true;

        setAuthError(null);

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);

        try {
            const result = await signUpAction({ error: null }, formData);

            if (result?.error) {
                setAuthError(result.error);
                setSubmitting(false);
            }
        } finally {
            isSubmittingRef.current = false;
        }
    };

    const handleSubmitLogin = async (
        values: LoginValues,
        { setSubmitting }: { setSubmitting: (v: boolean) => void }
    ) => {
        setAuthError(null);

        const { data, error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
        });

        if (error?.code === "EMAIL_NOT_VERIFIED") {
            await authClient.sendVerificationEmail({
                email: values.email,
                callbackURL: queryRedirect ?? "/profile",
            });
            router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
            return;
        }

        if (error) {
            setAuthError(error.message ?? "Login failed. Please check your credentials.");
            setSubmitting(false);
            return;
        }

        if (queryRedirect) {
            router.push(queryRedirect);
        } else {
            const role = (data?.user as any)?.role;
            const target = role === "candidate" ? "/profile" : "/dashboard";
            router.push(target);
        }
        router.refresh();
    };

    const handleSocialLogin = async (provider: "google" | "github") => {
        if (socialLoading) return;
        setAuthError(null);
        setSocialLoading(provider);

        try {
            const { error } = await authClient.signIn.social({
                provider,
                callbackURL: queryRedirect ?? "/profile",
            });

            if (error) {
                setAuthError(error.message ?? `Failed to sign in with ${provider}.`);
                setSocialLoading(null);
            }
        } catch (err: any) {
            setAuthError(err?.message ?? `An error occurred while signing in with ${provider}.`);
            setSocialLoading(null);
        }
    };

    return {
        handleSubmitLogin,
        handleSocialLogin,
        socialLoading,
        authError: authError || (urlError ? decodeURIComponent(urlError) : null),
        signUp,
    };
}
