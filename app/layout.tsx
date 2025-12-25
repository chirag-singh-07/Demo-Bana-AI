import type { Metadata } from "next";
import {Jost} from "next/font/google";
import "./globals.css";

const josefinSans = Jost({
  weight: ["100","200", "300" ,"400", "500" , "600" ,  "700", "800" , "900"],
})


export const metadata: Metadata = {
  title: "Demo Bana Ai",
  description: "Demo Bana Ai is AI tool to generate text to app design.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
