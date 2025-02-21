"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category as CategoryType } from "@/types/types";
import Category from "../components/Category";
// import Loader from "@/components/ui/Loader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
   const [categories, setCategories] = useState<CategoryType[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const supabase = createClientComponentClient();

   useEffect(() => {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
   }, []);

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const { data, error } = await supabase
               .from("categories")
               .select("*");
            if (error) throw error;
            setCategories(data || []);
         } catch (err) {
            setError(
               err instanceof Error ? err.message : "Failed to fetch categories"
            );
         } finally {
            setIsLoading(false);
         }
      };

      fetchCategories();
   }, [supabase]);

   // Stagger animation for categories
   const containerVariants = {
      hidden: { opacity: 0 },
      show: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
         },
      },
   };

   const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      show: {
         opacity: 1,
         y: 0,
         transition: {
            type: "spring",
            stiffness: 300,
            damping: 24,
         },
      },
   };

   if (isLoading) {
      return (
         <div className="mt-52 min-h-screen px-4">
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4">
                     <div className="space-y-3">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-20 w-full" />
                     </div>
                  </Card>
               ))}
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="mt-52 min-h-screen px-4">
            <Alert variant="destructive">
               <AlertDescription>{error}</AlertDescription>
            </Alert>
         </div>
      );
   }

   return (
      <motion.main
         className="mt-52 min-h-screen "
         variants={containerVariants}
         initial="hidden"
         animate="show"
      >
         <AnimatePresence mode="popLayout">
            {categories.map((category) => (
               <motion.div
                  key={category.id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, y: -20 }}
               >
                  <Category category={category} slug={category.slug} />
               </motion.div>
            ))}
            {categories.length === 0 && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
               >
                  <Card className="p-6">
                     <p className="text-gray-500">No categories found</p>
                  </Card>
               </motion.div>
            )}
         </AnimatePresence>
      </motion.main>
   );
}
