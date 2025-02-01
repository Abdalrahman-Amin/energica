import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Category as categoryType } from "@/types/types";

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
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const categories: categoryType[] = [
      {
         id: 1,
         title: "Batteries",
         slug: "batteries",
         image: "https://picsum.photos/200/300",
      },
      {
         id: 2,
         title: "UPS",
         slug: "ups",
         image: "https://picsum.photos/200/300",
      },
      {
         id: 3,
         title: "Inverters",
         slug: "inverters",
         image: "https://picsum.photos/200/300",
      },
      {
         id: 4,
         title: "AVR",
         slug: "avr",
         image: "https://picsum.photos/200/300",
      },
   ];
   return (
      <html lang="en" dir="ltr">
         <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
         >
            <Navbar categories={categories} />
            {children}
            <Footer />
         </body>
      </html>
   );
}
