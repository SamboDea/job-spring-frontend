import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [emailOTPClient()],
});

export const { signIn, signOut, signUp, useSession } = authClient;

// --- Password reset helpers ---
// The Better Auth client proxy converts camelCase method names to kebab-case
// paths (e.g. forgetPassword → /forget-password), but the actual server
// endpoint is /request-password-reset. We must call authClient.requestPasswordReset
// so the proxy maps it correctly to POST /api/auth/request-password-reset.

type AuthResult<T = unknown> = Promise<{
  data: T | null;
  error: { message?: string; status?: number } | null;
}>;

export const requestPasswordReset = (input: {
  email: string;
  redirectTo?: string;
}): AuthResult => (authClient as any).requestPasswordReset(input);

export const confirmPasswordReset = (input: {
  newPassword: string;
  token: string;
}): AuthResult => (authClient as any).resetPassword(input);