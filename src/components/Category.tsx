"use client";

import React, { useEffect, useState } from "react";
import ModelList from "./ModelList";
import { Category as categoryType } from "@/types/types";
import { Model } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Loader from "./Loader";
import { FaAngleRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";

interface CategoryProps {
   category: categoryType;
   slug: string;
}

const Category: React.FC<CategoryProps> = ({ category, slug }) => {
   const [models, setModels] = useState<Model[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const supabase = createClientComponentClient();
   const router = useRouter();
   useEffect(() => {
      const fetchModels = async () => {
         try {
            const { data, error } = await supabase
               .from("category_models")
               .select("models(*)")
               .eq("category_id", category.id);

            if (error) {
               throw error;
            }

            const modelsData = data.flatMap(
               (item: { models: Model[] }) => item.models
            );
            setModels(modelsData || []);
         } catch (error) {
            console.error("Error fetching models:", error);
            setError("Failed to fetch models. Please try again later.");
         } finally {
            setIsLoading(false);
         }
      };

      fetchModels();
   }, [category.id, supabase]);

   const handleNavigation = (id: number) => {
      router.push(`/category#category-${id}`);
   };

   if (isLoading) {
      return <Loader size="lg" />;
   }

   if (error) {
      return (
         <div className="flex justify-center items-center h-screen">
            <p className="text-red-500 text-lg">{error}</p>
         </div>
      );
   }

   return (
      category && (
         <section
            className="relative  px-3 xl:px-80 lg:px-40 md:px-20 bg-white"
            id={`category-${category.title}`}
         >
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
               <div className="absolute right-0 top-0 w-1/3 h-1/2 bg-gradient-to-bl from-blue-50/50 to-transparent rounded-full blur-3xl -z-10" />
               <div className="absolute left-0 bottom-0 w-1/4 h-1/3 bg-gradient-to-tr from-blue-50/30 to-transparent rounded-full blur-2xl -z-10" />
            </div>

            {/* Main Content Container */}
            <div className="relative max-w-[1920px] mx-auto">
               {/* Header: Category Title + Link */}
               <div className="flex flex-wrap items-center justify-between ">
                  {/* Category Title */}
                  <div
                     className="group cursor-pointer"
                     onClick={() => handleNavigation(category.id)}
                  >
                     <h2 className="text-3xl font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors duration-200">
                        {category.title}
                     </h2>
                     <div
                        className="h-1 w-12 bg-blue-600 rounded-full mt-2 transition-all duration-300 
                          group-hover:w-24 group-hover:bg-gradient-to-r from-blue-600 to-blue-400"
                     />
                  </div>

                  {/* See All Link */}
                  <button
                     onClick={() => handleNavigation(category.id)}
                     className="group flex items-center gap-1 px-4 py-2 rounded-full
                     text-blue-600 font-medium 
                     hover:text-blue-700
                     transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                     <span className="relative">
                        See all
                        <span
                           className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 
                             group-hover:scale-x-100 transition-transform duration-300"
                        />
                     </span>
                     <FaAngleRight
                        className="transform transition-transform duration-200 
                                   group-hover:translate-x-1"
                     />
                  </button>
               </div>

               {/* Content Border */}
               <div className="relative">
                  {/* Top Border Gradient */}
                  <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                  {/* Product List */}
                  <div className="">
                     <ModelList models={models} categorySlug={slug} />
                  </div>

                  {/* Bottom Border Gradient */}
                  <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
               </div>
            </div>
         </section>
      )
   );
};

export default Category;
