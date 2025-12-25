import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendOtpEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Rate limiting: Signup (5 requests per 15 minutes per IP)
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rlKey = `signup:ip:${ip}`;
    const rl = await checkRateLimit({
      key: rlKey,
      limit: 5,
      windowInMinutes: 15,
    });

    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        { status: 429 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user via Better Auth
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        // @ts-ignore - custom fields are supported but might need better typing
        emailOtp: otp,
        emailOtpExpiry: otpExpiry,
      },
    });

    // Send OTP Email
    await sendOtpEmail(email, otp);

    return NextResponse.json({
      success: true,
      message: "Check your email for the verification code.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
