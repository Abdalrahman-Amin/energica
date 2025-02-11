"use client";

import { useEffect } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
// import FloatingContactButton from "@/components/FloatingContactButton";
import useCategoryStore from "@/store/useCategoryStore";

export default function MainLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const { fetchCategories } = useCategoryStore();

   useEffect(() => {
      fetchCategories();
   }, [fetchCategories]);

   return (
      <>
         <Navbar />
         {children}
         {/* <FloatingContactButton /> */}
         <Footer />
      </>
   );
}
