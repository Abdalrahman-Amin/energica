"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category } from "@/types/types";

interface AddCategoryFormProps {
   setToggleAddedCategory: () => void;
   selectedCategory: Category | null;
   clearSelectedCategory: () => void;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({
   setToggleAddedCategory,
   selectedCategory,
   clearSelectedCategory,
}) => {
   const [title, setTitle] = useState("");
   const [loading, setLoading] = useState(false);
   const supabase = createClientComponentClient();

   useEffect(() => {
      if (selectedCategory) {
         setTitle(selectedCategory.title);
      }
   }, [selectedCategory]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
         if (selectedCategory) {
            // Update existing category
            const { data, error } = await supabase
               .from("categories")
               .update({ title, slug: title.toLowerCase().replace(" ", "-") })
               .eq("id", selectedCategory.id)
               .select();
            console.log("DEBUG: ~ handleSubmit ~ data:", data);

            if (error) throw error;
            alert("Category updated successfully!");
         } else {
            const { data, error } = await supabase
               .from("categories")
               .insert([{ title, slug: title.toLowerCase().replace(" ", "-") }])
               .select();
            console.log("DEBUG: ~ handleSubmit ~ data:", data);

            if (error) throw error;

            alert("Category added successfully!");
         }

         setTitle("");
         setToggleAddedCategory();
         clearSelectedCategory();
      } catch (error) {
         console.error("Error adding category:", error);
         alert("Failed to add category.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex items-center justify-center  bg-gray-900 text-white w-[90%]">
         <div className="bg-gray-800 shadow-xl rounded-lg p-8 w-full max-w-lg border border-gray-700">
            <h1 className="text-3xl font-semibold text-center text-gray-200 mb-6">
               {selectedCategory ? "Edit Category" : "Add Category"}
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
               <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-4 py-3 border border-gray-600 bg-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
               />
               <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-600 shadow-md"
               >
                  {loading
                     ? selectedCategory
                        ? "Updating..."
                        : "Adding..."
                     : selectedCategory
                     ? "Update Category"
                     : "Add Category"}
               </button>
            </form>
         </div>
      </div>
   );
};

export default AddCategoryForm;
