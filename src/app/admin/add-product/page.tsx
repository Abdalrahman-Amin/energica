"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Category, Model } from "@/types/types";

const AddProductForm = () => {
   const [categories, setCategories] = useState<Category[]>([]);
   const [models, setModels] = useState<Model[]>([]);
   const [selectedCategory, setSelectedCategory] = useState("");
   const [selectedModel, setSelectedModel] = useState("");
   const [title, setTitle] = useState("");
   const [image, setImage] = useState("");
   const [description, setDescription] = useState("");
   const [price, setPrice] = useState("");
   const [currency, setCurrency] = useState("USD");
   const [loading, setLoading] = useState(false);
   const supabase = createClientComponentClient();
   const router = useRouter();

   useEffect(() => {
      const fetchCategoriesAndModels = async () => {
         const { data: categoriesData, error: categoriesError } = await supabase
            .from("categories")
            .select("*");

         const { data: modelsData, error: modelsError } = await supabase
            .from("models")
            .select("*");

         if (categoriesError)
            console.error("Error fetching categories:", categoriesError);
         if (modelsError) console.error("Error fetching models:", modelsError);

         setCategories(categoriesData || []);
         setModels(modelsData || []);
      };

      fetchCategoriesAndModels();
   }, [supabase]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
         const { data, error } = await supabase
            .from("products")
            .insert([
               {
                  title,
                  image,
                  description,
                  price,
                  currency,
                  category: selectedCategory,
                  model: selectedModel,
               },
            ])
            .select();
         console.log("DEBUG: ~ handleSubmit ~ data:", data);

         if (error) throw error;

         alert("Product added successfully!");
         router.push("/admin/dashboard");
      } catch (error) {
         console.error("Error adding product:", error);
         alert("Failed to add product.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
         <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
            <h1 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">
               Add Product
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
               >
                  <option value="" disabled>
                     Select Category
                  </option>
                  {categories.map((category) => (
                     <option key={category.id} value={category.id}>
                        {category.title}
                     </option>
                  ))}
               </select>
               <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
               >
                  <option value="" disabled>
                     Select Model
                  </option>
                  {models.map((model) => (
                     <option key={model.id} value={model.id}>
                        {model.slug}
                     </option>
                  ))}
               </select>
               <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
               />
               <input
                  type="text"
                  placeholder="Image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
               />
               <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
               />
               <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
               />
               <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
               >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
               </select>
               <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-md disabled:bg-gray-400"
               >
                  {loading ? "Adding..." : "Add Product"}
               </button>
            </form>
         </div>
      </div>
   );
};

export default AddProductForm;
