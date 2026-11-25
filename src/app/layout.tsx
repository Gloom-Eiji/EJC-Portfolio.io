import type { Metadata, Viewport } from "next";
import { UnifrakturCook, Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const unifraktur = UnifrakturCook({
  variable: "--font-unifraktur",
  weight: "700",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Elijah Cortez — software engineer, designer and builder. CSUN Computer Science '26, Senior Project Showcase 1st place. Full-stack web and mobile, databases, security and data mining.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Elijah Cortez — Software Engineer",
    template: "%s · Elijah Cortez",
  },
  description,
  keywords: [
    "Elijah Cortez",
    "software engineer",
    "full-stack developer",
    "React",
    "Next.js",
    "React Native",
    "CSUN",
    "portfolio",
  ],
  authors: [{ name: "Elijah Cortez", url: "https://github.com/Gloom-Eiji" }],
  openGraph: {
    title: "Elijah Cortez — Software Engineer",
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elijah Cortez — Software Engineer",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${unifraktur.variable} ${cormorant.variable} ${plexMono.variable} antialiased`}
    >
      <body className="min-h-dvh">
        <a
          href="#main"
          className="label sr-only z-[110] bg-void px-4 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {children}
        <div className="vignette" aria-hidden />
        <div className="scanlines" aria-hidden />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
