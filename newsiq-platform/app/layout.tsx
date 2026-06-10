import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "NewsIQ — Smart News Intelligence Platform",
  description:
    "AI-powered news aggregation and analysis platform delivering personalised, multilingual news with sentiment analysis and real-time breaking alerts.",
  keywords: ["news", "AI", "Sri Lanka", "intelligence", "breaking news", "analysis"],
  authors: [{ name: "NewsIQ Team" }],
  openGraph: {
    title: "NewsIQ — Smart News Intelligence Platform",
    description: "AI-powered news aggregation with sentiment analysis and real-time alerts.",
    type: "website",
  },
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
      <body>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f1f5f9",
            },
          }}
        />
      </body>
    </html>
  );
}
