import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import CookieBanner from "@/components/CookieBanner";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "NewsIQ — Smart News Intelligence Platform",
  description:
    "AI-powered news aggregation and analysis platform delivering personalised, multilingual news with sentiment analysis and real-time breaking alerts.",
  keywords: ["news", "AI", "Sri Lanka", "intelligence", "breaking news", "analysis"],
  authors: [{ name: "NewsIQ Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NewsIQ",
  },
  openGraph: {
    title: "NewsIQ — Smart News Intelligence Platform",
    description: "AI-powered news aggregation with sentiment analysis and real-time alerts.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#060c18",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-red-500/30 selection:text-white">
        <AuthProvider>
          {children}
          <CookieBanner />
          <ScrollToTop />
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#0b1222",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#f1f5f9",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
