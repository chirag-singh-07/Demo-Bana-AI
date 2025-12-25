import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
// @ts-ignore - allow side-effect CSS import without type declarations
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const josefinSans = Jost({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Demo Bana Ai",
  description: "Demo Bana Ai is AI tool to generate text to app design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${josefinSans.className} ntialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="bottom-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
