import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "StudioX | Content Broadcasting System",
  description: "Premium educational content broadcasting and management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 selection:bg-blue-100 antialiased`}>
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors closeButton theme="light" />
        </AuthProvider>
      </body>
    </html>
  );
}
