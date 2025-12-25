"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Chrome } from "lucide-react";
import { OtpInput } from "@/components/auth/otp-input";
import { authClient } from "@/lib/auth-client";

function RegisterContent() {
  const [step, setStep] = useState<"register" | "otp">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const stepParam = searchParams.get("step");
    const emailParam = searchParams.get("email");
    if (stepParam === "otp" && emailParam) {
      setStep("otp");
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Registration failed");

      toast.success("Account created! Please check your email for the code.");
      setStep("otp");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Verification failed");

      toast.success("Email verified! You can now log in.");
      setStep("register");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to resend code");

      toast.success("New code sent!");
      setCountdown(60); // 1 minute cooldown
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setResending(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error: any) {
      toast.error("Failed to sign up with Google");
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
            <h2 className="text-2xl font-bold tracking-tight">
              {step === "register"
                ? "Create your account"
                : "Verify your email"}
            </h2>
            <p className="text-muted-foreground text-pretty">
              {step === "register"
                ? "Join the next generation of mobile app designers."
                : `We've sent a 6-digit code to ${email}`}
            </p>
          </div>

          <div className="space-y-4">
            {step === "register" ? (
              <>
                <Button
                  variant="outline"
                  className="w-full h-11 transition-all hover:bg-muted font-semibold"
                  onClick={handleGoogleLogin}
                >
                  <Chrome className="mr-2 h-5 w-5" />
                  Sign up with Google
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

                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold tracking-wide uppercase opacity-70"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 bg-background border-2 transition-all focus:border-foreground"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold tracking-wide uppercase opacity-70"
                    >
                      Email Address
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
                    <Label
                      htmlFor="password"
                      title="Password"
                      className="text-sm font-semibold tracking-wide uppercase opacity-70"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 bg-background border-2 transition-all focus:border-foreground"
                      disabled={loading}
                    />
                    <p className="text-[10px] text-muted-foreground font-bold tracking-tight">
                      MINIMUM 8 CHARACTERS
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-md font-bold uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98] mt-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </form>
              </>
            ) : (
              <div className="space-y-8 py-4">
                <OtpInput
                  length={6}
                  onComplete={handleVerifyOtp}
                  disabled={loading}
                />

                <div className="flex flex-col items-center gap-6">
                  <Button
                    variant="ghost"
                    onClick={handleResendOtp}
                    disabled={resending || countdown > 0}
                    className="text-sm font-bold uppercase tracking-wider h-11 transition-all"
                  >
                    {resending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : countdown > 0 ? (
                      `Resend code in ${countdown}s`
                    ) : (
                      "Didn't receive a code? Resend"
                    )}
                  </Button>

                  <Button
                    variant="link"
                    onClick={() => setStep("register")}
                    className="text-xs text-muted-foreground font-bold uppercase tracking-tighter flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Back to Registration
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center text-sm font-medium">
            Already have an account?{" "}
            <NextLink
              href="/login"
              className="text-primary hover:underline font-bold transition-colors"
            >
              Sign in
            </NextLink>
          </div>
        </div>
      </div>

      {/* Right Side: Visual Section */}
      <div className="hidden lg:block lg:w-1/2 relative bg-foreground">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-20"></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]"></div>

        <div className="relative h-full flex flex-col items-center justify-center p-12 text-background text-center space-y-12">
          <div className="space-y-4 max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
              Start your design <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-background to-background/50">
                journey here
              </span>
            </h2>
            <p className="text-lg text-background/70 font-medium">
              Join a community of forward-thinking designers crafting the future
              of mobile interfaces.
            </p>
          </div>

          <div className="relative">
            <div className="w-64 h-80 rounded-3xl border-2 border-background/20 bg-background/5 p-4 flex flex-col justify-end overflow-hidden">
              <div className="absolute top-4 left-4 right-4 h-1/2 bg-gradient-to-b from-background/10 to-transparent rounded-2xl border border-background/10"></div>
              <div className="h-2 w-16 bg-background/30 rounded-full mb-3"></div>
              <div className="h-2 w-28 bg-background/20 rounded-full mb-3"></div>
              <div className="h-2 w-24 bg-background/10 rounded-full"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-40 rounded-2xl border-2 border-background/20 bg-background/10 backdrop-blur-sm p-3 flex flex-col justify-end">
              <div className="h-1.5 w-8 bg-background/30 rounded-full mb-2"></div>
              <div className="h-1.5 w-14 bg-background/20 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
