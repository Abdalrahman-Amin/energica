"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import Loader from "@/components/Loader";
import { Category } from "@/types/types";

const CategoriesList = () => {
   const [categories, setCategories] = useState<Category[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const supabase = createClientComponentClient();

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const { data, error } = await supabase.from("categories").select("*");
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
   }, [supabase]);

   const handleDelete = async (id: number) => {
      const confirmDelete = confirm("Are you sure you want to delete this category?");
      if (!confirmDelete) return;

      try {
         const { error } = await supabase.from("categories").delete().eq("id", id);
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
      <div className="container mx-auto px-4 py-12">
         <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Categories
         </h1>
         <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full">
               <thead>
                  <tr className="bg-gray-100 border-b">
                     <th className="py-3 px-6 text-left font-semibold text-gray-700">Title</th>
                     <th className="py-3 px-6 text-center font-semibold text-gray-700">Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {categories.map((category) => (
                     <tr key={category.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-6">{category.title}</td>
                        <td className="py-3 px-6 text-center">
                           <Link href={`/admin/dashboard/categories/edit-category/${category.id}`}>
                              <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition">
                                 Edit
                              </button>
                           </Link>
                           <button
                              onClick={() => handleDelete(category.id)}
                              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
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
   );
};

export default CategoriesList;
