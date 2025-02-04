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
            className="mt-6 pt-10 shadow-lg rounded-xl p-6"
            id={`category-${category.id}`}
         >
            <div className="flex justify-between items-center">
               <h2 className="text-3xl font-bold text-purple-700">
                  {category.title}
               </h2>
               <a
                  href={`/products?category=${slug}`}
                  className="text-blue-500 hover:underline"
               >
                  See all products
               </a>
            </div>
            <ModelList models={models} />
         </section>
      )
   );
};

export default Category;
