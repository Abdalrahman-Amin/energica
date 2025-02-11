"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import BackButton from "@/components/BackButton";
import Loader from "@/components/Loader";

const EditCategoryForm = () => {
   const  {categoryId: id}  = useParams();
   console.log("DEBUG: ~ EditCategoryForm ~ id:", id)
   const [title, setTitle] = useState("");
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const supabase = createClientComponentClient();
   const router = useRouter();

   useEffect(() => {
      const fetchCategory = async () => {
         try {
            const { data, error } = await supabase
               .from("categories")
               .select("*")
               .eq("id",id)
               .single();

            if (error) {
               throw error;
            }

            setTitle(data.title);
         } catch (error) {
            console.error("Error fetching category:", error);
            setError("Failed to fetch category. Please try again later.");
         } finally {
            setLoading(false);
         }
      };

      fetchCategory();
   }, [id, supabase]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
         const { error } = await supabase
            .from("categories")
            .update({ title, slug: title.toLowerCase().replace(" ", "-") })
            .eq("id", id);

         if (error) {
            throw error;
         }

         // Redirect to categories list page
         router.push("/admin/dashboard/categories");
      } catch (error) {
         console.error("Error updating category:", error);
         setError("Failed to update category. Please try again later.");
      } finally {
         setLoading(false);
      }
   };

   if (loading) {
      return <Loader />;
   }

   if (error) {
      return (
         <div className="flex justify-center items-center h-screen">
            <p className="text-red-500 text-lg">{error}</p>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-12 mt-56">
         <BackButton />
         <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Edit Category
         </h1>
         <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
            <div className="mb-4">
               <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
               </label>
               <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
               />
            </div>
            <button
               type="submit"
               className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
               disabled={loading}
            >
               {loading ? "Updating..." : "Update Category"}
            </button>
         </form>
      </div>
   );
};

export default EditCategoryForm;