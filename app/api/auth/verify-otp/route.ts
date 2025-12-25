import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Rate limiting: OTP Verification (10 attempts per 15 minutes per email)
    const rlKey = `verify:email:${email}`;
    const rl = await checkRateLimit({
      key: rlKey,
      limit: 10,
      windowInMinutes: 15,
    });

    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please try again later." },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    if (!user.emailOtp || !user.emailOtpExpiry) {
      return NextResponse.json(
        { error: "No OTP found. Please request a new one." },
        { status: 400 }
      );
    }

    if (new Date() > user.emailOtpExpiry) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    if (user.emailOtp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Success: Update user
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        emailOtp: null,
        emailOtpExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
