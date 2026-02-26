import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://world-blog-kappa.vercel.app";
const siteTitle = "World Blog";
const siteDescription =
  "A practical build-in-public blog with notes, experiments, and shipping logs.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${siteTitle}`,
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: siteTitle,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="mx-auto min-h-screen max-w-5xl px-6">
          <header className="sticky top-0 z-20 mb-6 mt-4 rounded-2xl border border-zinc-200/70 bg-white/70 px-4 py-4 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/70">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                World Blog
              </Link>
              <nav className="flex items-center gap-5 text-sm text-zinc-700 dark:text-zinc-300">
                <Link href="/" className="hover:underline">
                  Home
                </Link>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
                <Link href="/about" className="hover:underline">
                  About
                </Link>
              </nav>
            </div>
          </header>

          {children}

          <footer className="mt-16 border-t border-zinc-200 py-8 text-sm text-zinc-500 dark:border-zinc-800">
            © {new Date().getFullYear()} World Blog · Built with Next.js.
          </footer>
        </div>
      </body>
    </html>
  );
}
