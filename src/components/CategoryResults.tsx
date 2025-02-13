"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// import Link from "next/link";
import Loader from "@/components/Loader";
import { Category } from "@/types/types";

interface CategoryResultsProps {
   toggleAddedCategory: boolean;
   onEditCategory: (category: Category) => void;
}

const CategoryResults: React.FC<CategoryResultsProps> = ({
   onEditCategory,
   toggleAddedCategory,
}) => {
   const [categories, setCategories] = useState<Category[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const supabase = createClientComponentClient();

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const { data, error } = await supabase
               .from("categories")
               .select("*");
            if (error) throw error;
            setCategories(data);
         } catch (error) {
            console.error("Error fetching categories:", error);
            setError("Failed to fetch categories. Please try again later.");
         } finally {
            setIsLoading(false);
         }
      };

      fetchCategories();
   }, [supabase, toggleAddedCategory]);

   const handleDelete = async (id: number) => {
      const confirmDelete = confirm(
         "Are you sure you want to delete this category?"
      );
      if (!confirmDelete) return;

      try {
         const { error } = await supabase
            .from("categories")
            .delete()
            .eq("id", id);
         if (error) throw error;
         setCategories(categories.filter((category) => category.id !== id));
      } catch (error) {
         console.error("Error deleting category:", error);
         setError("Failed to delete category. Please try again later.");
      }
   };

   if (isLoading) return <Loader />;

   if (error) {
      return (
         <div className="flex justify-center items-center h-screen">
            <p className="text-red-500 text-lg">{error}</p>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-12 bg-gray-900 min-h-screen w-[50rem]">
         <h1 className="text-3xl font-bold text-white mb-6 text-center">
            Categories
         </h1>
         <div className="bg-gray-50 shadow-lg rounded-xl overflow-hidden">
            {/* Wrapping the table for horizontal scrolling */}
            <div className="overflow-x-auto">
               <table className="min-w-full border-collapse">
                  <thead className="bg-gray-200 border-b sticky top-0">
                     <tr className="flex w-full">
                        <th className="py-4 px-6 text-left font-semibold text-gray-700 w-1/2">
                           Title
                        </th>
                        <th className="py-4 px-6 text-center font-semibold text-gray-700 w-1/2">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  {/* Scrollable tbody */}
                  <div className="h-[15rem] overflow-y-auto block w-full custom-scrollbar">
                     <tbody className="block w-full">
                        {categories.map((category) => (
                           <tr
                              key={category.id}
                              className="flex w-full border-b hover:bg-gray-100 transition"
                           >
                              <td className="py-4 px-6 w-1/2 text-gray-800">
                                 {category.title}
                              </td>
                              <td className="py-4 px-6 text-center w-1/2 flex justify-center gap-2">
                                 <button
                                    onClick={() => onEditCategory(category)}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-shadow shadow-md"
                                 >
                                    Edit
                                 </button>
                                 <button
                                    onClick={() => handleDelete(category.id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-shadow shadow-md"
                                 >
                                    Delete
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </div>
               </table>
            </div>
         </div>
      </div>
   );
};

export default CategoryResults;
