import { betterAuth } from "better-auth";
import { customSession, admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { pool } from "./db";
import { sendMail } from "./sendMail";

export const auth = betterAuth({
  database: pool,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      await sendMail({
        to: user.email,
        subject: "Reset your JobSpring password",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #111;">Reset your password</h2>
              <p style="color: #555;">
                  We received a request to reset the password for your JobSpring account.
                  Click the button below to choose a new password. This link expires in 1 hour.
              </p>
              <a href="${url}" style="display:inline-block; margin-top:16px; padding:12px 24px; border-radius:12px; background: linear-gradient(135deg, #07c4ec 0%, #71dd37 100%); color:#fff; font-weight:600; text-decoration:none;">
                  Reset Password
              </a>
              <p style="color: #999; font-size: 12px; margin-top: 24px;">
                  If you didn't request this, you can safely ignore this email.
              </p>
          </div>
        `,
      });
    },
    resetPasswordTokenExpiresIn: 3600,
    revokeSessionsOnPasswordReset: true,
  },

  emailVerification: {
    sendOnSignUp: true,

    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendMail({
        to: user.email,
        subject: "Verify your email address - JobSpring",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #07c4ec;">Verify your email address</h2>
            <p style="color: #555;">
              Thanks for signing up for JobSpring! Please verify your email
              address by clicking the button below.
            </p>
            <a href="${url}" style="
              display: inline-block;
              margin-top: 16px;
              padding: 12px 24px;
              border-radius: 12px;
              background: linear-gradient(135deg, #07c4ec 0%, #71dd37 100%);
              color: #fff;
              font-weight: 600;
              text-decoration: none;
            ">
              Verify Email
            </a>
            <p style="color: #999; font-size: 12px; margin-top: 24px;">
              If you didn't create an account with JobSpring, you can safely ignore this email.
            </p>
          </div>
        `,
      });
    },
  },

  socialProviders: {
    google: { clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! },
    github: { clientId: process.env.GITHUB_CLIENT_ID!, clientSecret: process.env.GITHUB_CLIENT_SECRET! },
  },

  session: {
    expiresIn: 60 * 60 * 2,
    updateAge: 0,
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 5 },
      "/request-password-reset": { window: 60, max: 3 },
    },
  },

  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  plugins: [
    admin({
      defaultRole: "candidate",
      adminRoles: ["admin"],
    }),

    customSession(async ({ user, session }) => {
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          role: (user as any).role ?? "user",
          banned: (user as any).banned ?? false,
          banReason: (user as any).banReason ?? null,
          banExpires: (user as any).banExpires ?? null,
        },
        session: {
          expiresAt: session.expiresAt,
        },
      };
    }),

    nextCookies(),
  ],
});