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
    const isSubmittingRef = useRef(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

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

        const { error } = await authClient.signIn.email({
            email: values.email,
            password: values.password,
        });


        if (error?.code === "EMAIL_NOT_VERIFIED") {
            await authClient.sendVerificationEmail({
                email: values.email,
                callbackURL: redirectTo,
            });
            router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
            return;
        }

        if (error) {
            setAuthError(error.message ?? "Login failed. Please check your credentials.");
            setSubmitting(false);
            return;
        }

        router.push(redirectTo);
    };

    return {
        handleSubmitLogin,
        authError,
        signUp
    }
}
