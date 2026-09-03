import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  title: "An Anus that Shits blog",
  description: "A Critical Reading Log & Essay Archive",
  openGraph: {
    title: "An Anus that Shits blog",
    description: "A Critical Reading Log & Essay Archive",
    type: "website",
    images: [
      {
        url: "/bookshelf-thumbnail.webp",
        width: 1200,
        height: 630,
        alt: "An Anus that Shits blog bookshelf",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "An Anus that Shits blog",
    description: "A Critical Reading Log & Essay Archive",
    images: ["/bookshelf-thumbnail.webp"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-[#0f0d0e] antialiased">{children}</body>
    </html>
  );
}
