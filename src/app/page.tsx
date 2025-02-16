"use client";
import React, { useState, useEffect } from "react";
import Category from "../components/Category";
import { Category as categoryType } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Loader from "@/components/Loader";

export default function Home() {
   const [categories, setCategories] = useState<categoryType[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const supabase = createClientComponentClient();

   useEffect(() => {
      const fetchCategories = async () => {
         setIsLoading(true);
         const { data, error } = await supabase.from("categories").select("*");
         if (error) {
            console.error("Error fetching categories:", error);
         } else {
            setCategories(data || []);
         }
         setIsLoading(false);
      };

      fetchCategories();
   }, [supabase]);

   if (isLoading) {
      return <Loader />;
   }

   return (
      <main className="mt-52 min-h-screen">
         {categories.map((category) => (
            <Category
               key={category.id}
               category={category}
               slug={category.slug}
            />
         ))}
      </main>
   );
}
