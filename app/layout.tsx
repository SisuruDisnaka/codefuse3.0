import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CodeWall } from "@/components/code-wall";
import { eventConfig } from "@/data/event";

const display = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: `${eventConfig.eventName} ${eventConfig.edition} | ${eventConfig.tagline}`,
  description: eventConfig.description,
  metadataBase: new URL("https://codefuse3.example.com"),
  openGraph: {
    title: `${eventConfig.eventName} ${eventConfig.edition} | ${eventConfig.tagline}`,
    description: eventConfig.description,
    images: ["/logo.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${eventConfig.eventName} ${eventConfig.edition} | ${eventConfig.tagline}`,
    description: eventConfig.description,
    images: ["/logo.png"],
  },
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="relative min-h-screen font-display antialiased overflow-x-hidden bg-void-950">
        <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-void-950 via-void-900 to-void-950" />
        <CodeWall />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
