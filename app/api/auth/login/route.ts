import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Rate limiting: Login (10 attempts per 15 minutes per email)
    const rlKey = `login:email:${email}`;
    const rl = await checkRateLimit({
      key: rlKey,
      limit: 10,
      windowInMinutes: 15,
    });

    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check verification
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          error: "Email not verified",
          notVerified: true,
        },
        { status: 403 }
      );
    }

    // All good: Create session using Better Auth
    // Better Auth will verify the password internally
    const response = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return response;
  } catch (error) {
    if (error instanceof Response) return error;
    // Better Auth throws a Response object on errors sometimes,
    // or we can catch it and return a custom message.
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Invalid credentials or server error" },
      { status: 401 }
    );
  }
}
