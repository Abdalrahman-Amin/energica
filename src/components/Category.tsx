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
      category && (
         <section
            className="space-y-6 mt-6 custom-height pt-10 bg-white shadow-lg rounded-xl p-6"
            id={`category-${category.id}`}
         >
            <h2 className="text-3xl font-bold text-purple-700 text-center">
               {category.title}
            </h2>
            <ModelList models={models} />
         </section>
      )
   );
};

export default Category;
