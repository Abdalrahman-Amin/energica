"use client";

import { useCallback, useEffect } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
// import FloatingContactButton from "@/components/FloatingContactButton";
import useCategoryStore from "@/store/useCategoryStore";
import { usePathname } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function MainLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const { fetchCategories } = useCategoryStore();
   const pathname = usePathname();
   const supabase = createClientComponentClient();

   useEffect(() => {
      fetchCategories();
   }, [fetchCategories]);

   const handleLogout = useCallback(async () => {
      await supabase.auth.signOut();
   }, [supabase]);

   useEffect(() => {
      if (pathname !== "/admin/dashboard") {
         handleLogout();
      }
   }, [pathname, handleLogout]);

   return (
      <>
         <Navbar />
         {children}
         <Footer />
      </>
   );
}
