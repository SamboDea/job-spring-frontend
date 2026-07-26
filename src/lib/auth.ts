import { betterAuth } from "better-auth";
import { customSession, emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { pool } from "./db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: pool,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }) => {
      await resend.emails.send({
        from: "JobSpring <onboarding@resend.dev>",
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
    emailOTP({
      sendVerificationOTP: async ({ email, otp, type }) => {
        await resend.emails.send({
          from: "JobSpring <onboarding@resend.dev>",
          to: email,
          subject: "Your JobSpring verification code",
          html: `
                        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
                            <h2 style="color: #07c4ec;">Verify your email</h2>
                            <p>Enter this code to verify your JobSpring account:</p>
                            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333; background: #f5f5f5; padding: 16px 24px; border-radius: 8px; text-align: center; margin: 20px 0;">
                                ${otp}
                            </div>
                            <p style="color: #888; font-size: 13px;">This code expires in 5 minutes. If you didn't request this, you can ignore this email.</p>
                        </div>
                    `,
        });
      },
      otpLength: 6,
      expiresIn: 300,
      sendVerificationOnSignUp: true,
    }),

    customSession(async ({ user, session }) => {
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
        },
        session: {
          expiresAt: session.expiresAt,
        },
      };
    }),


    nextCookies(),
  ],
});