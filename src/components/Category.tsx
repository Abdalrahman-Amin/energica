"use client";

import React, { useEffect, useState } from "react";
import ModelList from "./ModelList";
import { Category as categoryType } from "@/types/types";
import { Model } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Loader from "./Loader";

interface CategoryProps {
   category: categoryType;
   slug: string;
}

const Category: React.FC<CategoryProps> = ({ category, slug }) => {
   const [models, setModels] = useState<Model[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const supabase = createClientComponentClient();

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
            className=" pt-6 pb-6 px-6    border border-gray-200 transition-all duration-300 ease-in-out transform "
            id={`category-${category.title}`}
         >
            {/* Header: Category Title + Link */}
            <div className="flex flex-wrap items-center justify-between border-b border-gray-300 pb-4 mb-6 ">
               <h2 className="text-3xl font-bold text-blue-700 tracking-wide cursor-pointer">
                  <a href={`/category/${slug}/products`}>{category.title}</a>
               </h2>
               <a
                  href={`/category/${slug}`}
                  className="text-lg text-blue-600 font-medium hover:text-blue-700 hover:underline transition-all duration-200"
               >
                  See all products
               </a>
            </div>

            {/* Product List */}
            <ModelList models={models} categorySlug={slug} />
         </section>
      )
   );
};

export default Category;
