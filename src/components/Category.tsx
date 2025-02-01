"use client";

import React, { useEffect, useState } from "react";
import ModelList from "./ModelList";
import { Category as categoryType } from "@/types/types";
import { Model } from "@/types/types";

interface CategoryProps {
   category: categoryType;
}

const Category: React.FC<CategoryProps> = ({ category }) => {
   // const [category, setCategory] = useState<Category | null>(null);
   const [models, setModels] = useState<Model[]>([]);

   useEffect(() => {
      // Using random data for now
      const randomModels: Model[] = Array.from({ length: 3 }, (_, i) => ({
         id: i + 1,
         created_at: new Date().toISOString(),
         slug: `model-${i + 1}`,
         title: `Model ${i + 1}`,
         description: `Description for model ${i + 1}`,
         image: `https://picsum.photos/200/300`,
      }));
      setModels(randomModels);
   }, []);

   return (
      <>
         {category && (
            <section
               className="space-y-4 mt-2 custom-height pt-8"
               id={`category-${category.id}`}
            >
               {/* Category Title */}
               <h2 className="text-2xl font-bold text-gray-900 text-center">
                  {category.title}
               </h2>

               {/* Model List */}
               <ModelList models={models} />
            </section>
         )}
      </>
   );
};

export default Category;
