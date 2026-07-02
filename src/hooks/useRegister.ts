import { useRef, useState } from "react";
import { signUpAction } from "@/app/actions/auth";

interface SignUpValues {
    name: string;
    email: string;
    password: string;
}

export function useSignUp() {
    const [authError, setAuthError] = useState<string | null>(null);
    const isSubmittingRef = useRef(false);

    const signUp = async (
        values: SignUpValues,
        setSubmitting: (v: boolean) => void
    ) => {
        if (isSubmittingRef.current) return; // ignore any overlapping call
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
            // On success, signUpAction redirects server-side.
        } finally {
            isSubmittingRef.current = false;
        }
    };

    return { authError, signUp };
}