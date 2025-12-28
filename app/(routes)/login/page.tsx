"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Chrome } from "lucide-react";
import { emailSignIn } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use Better Auth client directly to ensure session cookies are set
      const response = await emailSignIn({
        email,
        password,
      });

      console.log("Login response:", response);

      if (response.error) {
        if (response.error.message?.includes("Email not verified")) {
          toast.error("Please verify your email first.");
          router.push(`/register?email=${encodeURIComponent(email)}&step=otp`);
          return;
        }
        throw new Error(response.error.message || "Login failed");
      }

      toast.success("Logged in successfully!");
      // Refresh to update session state
      router.refresh();
      router.push("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error: any) {
      toast.error("Failed to login with Google");
    }
  };

  return (
    <div className="flex min-h-screen bg-background overflow-hidden font-sans">
      {/* Back to Home Button */}
      <div className="absolute top-8 left-8 z-50">
        <NextLink href="/">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 transition-transform hover:-translate-x-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </NextLink>
      </div>

      {/* Left Side: Form */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 xl:px-24">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Demp Bana AI
            </h1>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">
              Please enter your credentials to access your workspace.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full h-11 transition-all hover:bg-muted font-semibold"
              onClick={handleGoogleLogin}
            >
              <Chrome className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-medium">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold tracking-wide uppercase opacity-70"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 bg-background border-2 transition-all focus:border-foreground"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    title="Password"
                    className="text-sm font-semibold tracking-wide uppercase opacity-70"
                  >
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-background border-2 transition-all focus:border-foreground"
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-md font-bold uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </div>

          <div className="text-center text-sm font-medium">
            Don't have an account?{" "}
            <NextLink
              href="/register"
              className="text-primary hover:underline font-bold transition-colors"
            >
              Create an account
            </NextLink>
          </div>
        </div>
      </div>

      {/* Right Side: Visual Section */}
      <div className="hidden lg:block lg:w-1/2 relative bg-foreground">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-20"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>

        <div className="relative h-full flex flex-col items-center justify-center p-12 text-background text-center space-y-8">
          <div className="space-y-4 max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
              Design mobile apps <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-background to-background/50">
                in minutes
              </span>
            </h2>
            <p className="text-lg text-background/70 font-medium">
              Join thousands of creators building premium mobile experiences
              with our high-contrast AI design studio.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm opacity-50 select-none pointer-events-none">
            <div className="h-40 rounded-3xl border-2 border-background/20 bg-background/5 p-4 flex flex-col justify-end">
              <div className="h-2 w-12 bg-background/20 rounded-full mb-2"></div>
              <div className="h-2 w-20 bg-background/20 rounded-full"></div>
            </div>
            <div className="h-40 rounded-3xl border-2 border-background/20 bg-background/5 p-4 flex flex-col justify-end">
              <div className="h-2 w-12 bg-background/20 rounded-full mb-2"></div>
              <div className="h-2 w-20 bg-background/20 rounded-full"></div>
            </div>
            <div className="h-40 rounded-3xl border-2 border-background/20 bg-background/5 p-4 flex flex-col justify-end">
              <div className="h-2 w-12 bg-background/20 rounded-full mb-2"></div>
              <div className="h-2 w-20 bg-background/20 rounded-full"></div>
            </div>
            <div className="h-40 rounded-3xl border-2 border-background/20 bg-background/5 p-4 flex flex-col justify-end">
              <div className="h-2 w-12 bg-background/20 rounded-full mb-2"></div>
              <div className="h-2 w-20 bg-background/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
