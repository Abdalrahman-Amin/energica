import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/MainLayout";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "متجر إنرجيكا",
   description: "تسوق أحدث الأجهزة في مصر",
   icons: {
      icon: "/logo.png", // Default icon
   },
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" dir="ltr">
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
         >
            <MainLayout>{children}</MainLayout>
         </body>
      </html>
   );
}
