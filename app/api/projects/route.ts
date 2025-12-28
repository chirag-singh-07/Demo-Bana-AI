
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";
import { generateProjectName } from "@/actions";

// OPTIONAL: runtime hint (edge only if prisma supports it)
// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Parse & validate input
    const body = await req.json();
    const prompt = body?.prompt?.trim();

    if (!prompt || prompt.length < 10 || prompt.length > 2000) {
      return NextResponse.json(
        { error: "Prompt must be between 10 and 2000 characters" },
        { status: 400 }
      );
    }

    // 2️⃣ Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // 3️⃣ Generate project name (can be slow → isolated)
    const projectName = await generateProjectName(prompt);

    // 4️⃣ Create project (secure write)
    const project = await prisma.project.create({
      data: {
        name: projectName,
        prompt,
        userId,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    // Inngest Function could be called here for post-create processing

    return NextResponse.json(project, { status: 201 });

  } catch (error) {
    // 5️⃣ Safe logging (no leaks)
    console.error("Create Project Error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

