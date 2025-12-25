import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url }) {
      // You can implement password reset here later if needed
      console.log(`Reset password for ${user.email}: ${url}`);
    },
  },
  user: {
    additionalFields: {
      emailOtp: {
        type: "string",
        required: false,
      },
      emailOtpExpiry: {
        type: "date",
        required: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  // Ensure the baseURL is set correctly for both local and production
  baseURL: process.env.AUTH_URL || "http://localhost:3000",
});
