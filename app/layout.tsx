import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

export const viewport: Viewport = {
  themeColor: "#090d16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export const metadata: Metadata = {
  title: "Campus Study Spot Finder — Find Quiet, Power & Focus",
  description: "Live interactive campus map and guide for finding the best study spots, quiet libraries, power outlets, and real-time crowd busyness meters.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "StudySpot"
  },
  openGraph: {
    title: "Campus Study Spot Finder",
    description: "Never wander the library looking for an outlet again. Real-time busyness, noise levels, and hidden campus study gems.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/icon.svg" sizes="any" />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
