import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [adminClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;

// --- Email verification & Password management ---
export const sendVerificationEmail = authClient.sendVerificationEmail;
export const requestPasswordReset = authClient.requestPasswordReset;
export const confirmPasswordReset = authClient.resetPassword;
export const changePassword = authClient.changePassword;
export const resetPassword = authClient.resetPassword;