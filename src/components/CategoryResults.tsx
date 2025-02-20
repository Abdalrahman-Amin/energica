"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Loader from "@/components/ui/Loader";
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
            console.log("DEBUG: ~ fetchCategories ~ error:", error);
            setError("Failed to fetch categories. Please try again later.");
         } finally {
            setIsLoading(false);
         }
      };

      fetchCategories();
   }, [toggleAddedCategory, supabase]);

   const handleDelete = async (id: number) => {
      if (!confirm("Are you sure you want to delete this category?")) return;

      try {
         const { error } = await supabase
            .from("categories")
            .delete()
            .eq("id", id);
         if (error) throw error;
         setCategories(categories.filter((category) => category.id !== id));
      } catch (error) {
         console.log("DEBUG: ~ handleDelete ~ error:", error);
         setError("Failed to delete category. Please try again later.");
      }
   };

   if (isLoading) return <Loader />;
   if (error)
      return <p className="text-red-500 text-lg text-center">{error}</p>;

   return (
      <div className="container mx-auto px-4 py-6 bg-gray-900 w-full">
         <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center">
            Categories
         </h1>
         <div className="bg-gray-50 shadow-lg rounded-xl overflow-hidden">
            {/* Scrollable container for better mobile UX */}
            <div className="overflow-x-auto">
               <table className="min-w-full border-collapse">
                  <thead className="bg-gray-200 border-b sticky top-0">
                     <tr className="w-full flex">
                        <th className="py-3 px-4 text-left font-semibold text-gray-700 w-2/5">
                           Title
                        </th>
                        <th className="py-3 px-4 text-center font-semibold text-gray-700 w-3/5">
                           Actions
                        </th>
                     </tr>
                  </thead>
                  <tbody className="block w-full h-[15rem] overflow-y-auto">
                     {categories.map((category) => (
                        <tr
                           key={category.id}
                           className="w-full flex border-b hover:bg-gray-100 transition"
                        >
                           <td className="py-3 px-4 w-2/5 text-gray-800">
                              {category.title}
                           </td>
                           <td className="py-3 px-4 w-3/5 flex flex-col sm:flex-row justify-center gap-2">
                              <button
                                 onClick={() => onEditCategory(category)}
                                 className="bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                              >
                                 Edit
                              </button>
                              <button
                                 onClick={() => handleDelete(category.id)}
                                 className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
                              >
                                 Delete
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};

export default CategoryResults;
