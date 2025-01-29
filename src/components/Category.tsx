"use client";

import React, { useEffect, useState } from "react";
import ModelList from "./ModelList";

interface Category {
   id: number;
   created_at: string;
   slug: string;
   title: string;
}

interface Model {
   id: number;
   created_at: string;
   slug: string;
   title: string;
   description: string;
   image: string;
}

// interface Product {
//     id: number;
//     created_at: string;
//     title: string;
//     image: string;
//     description: string;
//     price: number;
//     currency: string;
//     category: number;
//     model: number;
// }

interface CategoryProps {
   categoryId: number;
}

const Category: React.FC<CategoryProps> = ({ categoryId }) => {
   const [category, setCategory] = useState<Category | null>(null);
   const [models, setModels] = useState<Model[]>([]);

   useEffect(() => {
      // Using random data for now
      const randomCategory: Category = {
         id: categoryId,
         created_at: new Date().toISOString(),
         slug: `category-${categoryId}`,
         title: `Category ${categoryId}`,
      };
      setCategory(randomCategory);

      const randomModels: Model[] = Array.from({ length: 3 }, (_, i) => ({
         id: i + 1,
         created_at: new Date().toISOString(),
         slug: `model-${i + 1}`,
         title: `Model ${i + 1}`,
         description: `Description for model ${i + 1}`,
         image: `https://picsum.photos/200/300`,
      }));
      setModels(randomModels);
   }, [categoryId]);

   return (
      <div className="category-container mt-7">
         {category && (
            <div className="space-y-4">
               {/* Category Title */}
               <h2 className="text-2xl font-bold text-gray-900">
                  {category.title}
               </h2>

               {/* Model List */}
               <ModelList models={models} />
            </div>
         )}
      </div>
   );
};

export default Category;
