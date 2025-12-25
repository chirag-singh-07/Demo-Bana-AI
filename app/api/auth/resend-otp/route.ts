import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Rate limiting: OTP Resend (3 attempts per 15 minutes per email)
    const rlKey = `resend:email:${email}`;
    const rl = await checkRateLimit({
      key: rlKey,
      limit: 3,
      windowInMinutes: 15,
    });

    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many resend attempts. Please wait 15 minutes." },
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

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
      where: { email },
      data: {
        emailOtp: otp,
        emailOtpExpiry: otpExpiry,
      },
    });

    // Send OTP Email
    await sendOtpEmail(email, otp);

    return NextResponse.json({
      success: true,
      message: "New verification code sent.",
    });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
