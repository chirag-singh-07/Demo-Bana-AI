import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export async function generateProjectName(prompt: string): Promise<string> {
//   // A simple mock implementation that generates a project name based on the prompt.
//   // In a real-world scenario, this could involve more complex logic or AI integration.
//   const words = prompt.split(" ");
//   const name = words.slice(0, 3).join(" ");
//   return `Project: ${name.charAt(0).toUpperCase() + name.slice(1)}`;
// }