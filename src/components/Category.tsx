"use client";

import React, { useEffect, useState } from "react";
import ModelList from "./ModelList";
import { Category as categoryType } from "@/types/types";
import { Model } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface CategoryProps {
   category: categoryType;
   slug: string;
}

const Category: React.FC<CategoryProps> = ({ category, slug }) => {
   const [models, setModels] = useState<Model[]>([]);
   const supabase = createClientComponentClient();

   useEffect(() => {
      const fetchModels = async () => {
         const { data, error } = await supabase
            .from("category_models")
            .select("models(*)")
            .eq("category_id", category.id);

         if (error) {
            console.error("Error fetching models:", error);
         } else {
            const modelsData = data.flatMap(
               (item: { models: Model[] }) => item.models
            );
            console.log("DEBUG: ~ fetchModels ~ modelsData:", modelsData);
            setModels(modelsData || []);
         }
      };

      fetchModels();
   }, [category.id, supabase]);

   return (
      category && (
         <section
            className="mt-6 pt-10 pb-6 px-6 bg-white shadow-xl rounded-2xl border border-gray-200 transition-all duration-300 hover:shadow-2xl"
            id={`category-${category.title}`}
         >
            {/* Header: Category Title + Link */}
            <div className="flex flex-wrap items-center justify-between border-b border-gray-300 pb-4 mb-6">
               <h2 className="text-3xl font-bold text-blue-700 tracking-wide">
                  {category.title}
               </h2>
               <a
                  href={`/category/${slug}/products`}
                  className="text-lg text-blue-600 font-medium hover:text-blue-700 hover:underline transition-all duration-200"
               >
                  See all products →
               </a>
            </div>

            {/* Product List */}
            <ModelList models={models} categorySlug={slug} />
         </section>
      )
   );
};

export default Category;
