import Navbar from "@/shared/components/Navbar";
import { QueryProvider } from "@/shared/components/providers/QueryProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "sweetalert2/src/sweetalert2.scss";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tempjob",
  description: "ระบบค้นหาผู้สมัครงานที่ต้องการจัดงาน",
  icons: {
    icon: "/tjLogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" content="light only" className="light">
      <QueryProvider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          <div className="min-h-screen flex flex-col bg-primary">
            {children}
          </div>
        </body>
      </QueryProvider>
    </html>
  );
}
