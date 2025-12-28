// "use server";
// import { openrouter } from "@/lib/openrouter";
// import { generateText } from "ai";

// export async function generateProjectName(prompt: string): Promise<string> {
//   try {
//     const { text } = await generateText({
//       model: openrouter.chat("google/gemini-2.5-flash-lite"),
//       system: `You are a creative assistant that generates very very short project names based on user prompts.
//             - keep it under 5 words
//             - make it catchy and relevant to the content
//             - Capitalize words appropriately
//             - Do not include special characters`,
//       prompt: prompt,
//     });
//     return text?.trim() || "Untitled Project";
//   } catch (error) {
//     console.error("Error generating project name:", error);
//     return "Untitled Project";
//   }
// }

"use server";

import { openrouter } from "@/lib/openrouter";
import { generateText } from "ai";


const nameCache = new Map<string, string>();

export async function generateProjectName(prompt: string): Promise<string> {
  try {
    // 1️⃣ Guard input (security + cost)
    const cleanPrompt = prompt.trim().slice(0, 500);
    if (!cleanPrompt) return "Untitled Project";    

    // 2️⃣ Cache hit (HUGE speed + cost win)
    if (nameCache.has(cleanPrompt)) {
      return nameCache.get(cleanPrompt)!;
    }

    // 3️⃣ Timeout protection
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6_000);

    const { text } = await generateText({
      model: openrouter.chat("google/gemini-2.5-flash-lite"),
      system: `Generate a very short project name.
Rules:
- Max 5 words
- Capitalize Each Word
- No emojis
- No special characters
- No quotes
- Relevant to the prompt`,
      prompt: cleanPrompt,
      //   maxTokens: 12, // 🔥 cost control
      temperature: 0.4, // 🔥 consistency
      //   signal: controller.signal,
    });

    clearTimeout(timeout);

    // 4️⃣ Sanitize output (VERY IMPORTANT)
    const safeName =
      text
        ?.replace(/[^a-zA-Z0-9\s]/g, "")
        .trim()
        .split(/\s+/)
        .slice(0, 5)
        .join(" ") || "Untitled Project";

    // 5️⃣ Cache result
    nameCache.set(cleanPrompt, safeName);

    return safeName;
  } catch (error) {
    console.error("Project name generation failed:", error);
    return "Untitled Project";
  }
}
