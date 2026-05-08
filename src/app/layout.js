import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://studiox-broadcasting.vercel.app"),
  title: "StudioX | Content Broadcasting System",
  description: "Educational content broadcasting and management system for teachers and principals.",
  icons: {
    icon: { url: "/favicon.png", type: "image/png" },
    apple: "/favicon.png",
  },
  openGraph: {
    title:       "StudioX | Content Broadcasting System",
    description: "Educational content broadcasting for teachers and principals.",
    type:        "website",
    url:         "https://studiox-broadcasting.vercel.app",
  },
};

export const viewport = {
  width:      "device-width",
  initialScale: 1,
  themeColor: "#2563EB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-[#F4F5F7] text-gray-900 antialiased selection:bg-blue-100`}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors closeButton theme="light" />
        </AuthProvider>
      </body>
    </html>
  );
}
