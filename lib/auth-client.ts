import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.AUTH_URL ||
    "http://localhost:3000",
  fetchOptions: {
    onError: async (e) => {
      console.error("Auth error:", e);
    },
  },
});

export const { useSession, signIn, signUp, signOut } = authClient;

// Explicit sign in methods
export const emailSignIn = (credentials: { email: string; password: string }) =>
  authClient.signIn.email(credentials);

export const emailSignUp = (credentials: {
  email: string;
  password: string;
  name?: string;
}) => authClient.signUp.email(credentials);
