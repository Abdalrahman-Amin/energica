"use client";
import { useEffect } from "react";
import { AppProps } from "next/app";
import useCategoryStore from "@/store/useCategoryStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingContactButton from "./components/FloatingContactButton";

function MyApp({ children }: React.PropsWithChildren<AppProps>) {
   const { fetchCategories } = useCategoryStore();

   useEffect(() => {
      fetchCategories();
   }, [fetchCategories]);

   return (
      <>
         <Navbar />
         {children}
         <FloatingContactButton />
         <Footer />
      </>
   );
}

export default MyApp;
