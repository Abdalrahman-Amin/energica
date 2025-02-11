"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

const AddCategoryForm = () => {
   const [title, setTitle] = useState("");
   const [loading, setLoading] = useState(false);
   const supabase = createClientComponentClient();
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
         const { data, error } = await supabase
            .from("categories")
            .insert([{ title, slug: title.toLowerCase().replace(" ", "-") }])
            .select();
         console.log("DEBUG: ~ handleSubmit ~ data:", data);

         if (error) throw error;

         alert("Category added successfully!");
         router.push("/admin/dashboard/categories");
      } catch (error) {
         console.error("Error adding category:", error);
         alert("Failed to add category.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-purple-200">
         <div style={{ position: "absolute", top: "10px", left: "10px" }}>
            <BackButton />
         </div>
         <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-gray-200">
            <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
               Add Category
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
               <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-4 py-3 border rounded-xl focus:ring-4 focus:ring-blue-500 focus:outline-none bg-gray-50"
                  required
               />
               <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:bg-gray-400 shadow-lg"
               >
                  {loading ? "Adding..." : "Add Category"}
               </button>
            </form>
         </div>
      </div>
   );
};

export default AddCategoryForm;
