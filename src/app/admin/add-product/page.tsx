"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Category, Model, Category_Models } from "@/types/types";
import BackButton from "@/components/BackButton";

const AddProductForm = () => {
   const [categories, setCategories] = useState<Category[]>([]);
   const [models, setModels] = useState<Model[]>([]);
   const [selectedCategory, setSelectedCategory] = useState("");
   const [selectedModel, setSelectedModel] = useState("");
   const [filteredModels, setFilteredModels] = useState<Model[]>([]);
   const [categoryModels, setCategoryModels] = useState<Category_Models[]>([]);
   const [title, setTitle] = useState("");
   const [image, setImage] = useState<File | null>(null);
   const [description, setDescription] = useState("");
   const [loading, setLoading] = useState(false);
   const supabase = createClientComponentClient();
   const router = useRouter();

   const handlePdfUpload = async (
      file: File,
      bucketName: string,
      path: string
   ) => {
      // Upload the PDF file to Supabase Storage
      const uniqueFileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
         .from(bucketName) // Bucket name   model-pdfs
         .upload(`${path}/${uniqueFileName}`, file); // File path and file object  `pdfs/${file.name}`

      if (error) {
         console.error("Error uploading PDF:", error);
         return null;
      }

      // Return the public URL of the uploaded file
      return supabase.storage.from(bucketName).getPublicUrl(data.path);
   };

   useEffect(() => {
      const fetchCategoriesAndModels = async () => {
         const { data: categoriesData, error: categoriesError } = await supabase
            .from("categories")
            .select("*");
         console.log(
            "DEBUG: ~ fetchCategoriesAndModels ~ categoriesData:",
            categoriesData
         );

         const { data: modelsData, error: modelsError } = await supabase
            .from("models")
            .select("*");

         const { data: categoryModelsData, error: categoryModelsError } =
            await supabase.from("category_models").select("*");
         console.log(
            "DEBUG: ~ fetchCategoriesAndModels ~ categoryModelsData:",
            categoryModelsData
         );

         if (categoriesError)
            console.error("Error fetching categories:", categoriesError);
         if (modelsError) console.error("Error fetching models:", modelsError);
         if (categoryModelsError)
            console.error(
               "Error fetching category models:",
               categoryModelsError
            );

         setCategories(categoriesData || []);
         setModels(modelsData || []);
         setCategoryModels(categoryModelsData || []);
      };

      fetchCategoriesAndModels();
   }, [supabase]);
   useEffect(() => {
      if (selectedCategory) {
         console.log(
            "DEBUG: ~ useEffect ~ selectedCategory:",
            selectedCategory
         );
         // Filter models based on selected category
         const filteredCategoryModels: Category_Models[] =
            categoryModels.filter((item) => {
               return item.category_id === Number(selectedCategory);
            });
         const modelIds: number[] = filteredCategoryModels.map(
            (item) => item.model_id
         );
         console.log(
            "DEBUG: ~ filteredCategoryModels ~ filteredCategoryModels:",
            filteredCategoryModels
         );

         const filtered = models.filter((model) => modelIds.includes(model.id));
         setFilteredModels(filtered);
      } else {
         setFilteredModels([]);
      }
   }, [selectedCategory, models, categoryModels]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
         let imgUrl = null;
         if (image) {
            const uploadResponse = await handlePdfUpload(
               image,
               "model-image-files",
               `imgs`
            );
            if (!uploadResponse) {
               alert("Failed to upload img.");
               setLoading(false);
               return;
            }
            imgUrl = uploadResponse.data.publicUrl;
         }
         const slug = title.toLowerCase().replace(" ", "-");
         const { data, error } = await supabase
            .from("products")
            .insert([
               {
                  title,
                  image: imgUrl,
                  description,
                  category: selectedCategory,
                  model: selectedModel,
                  slug,
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
         <div style={{ position: "absolute", top: "10px", left: "10px" }}>
            <BackButton />
         </div>
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
                  {filteredModels.map((model) => (
                     <option key={model.id} value={model.id}>
                        {model.title}
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
               {/* <input
                  type="text"
                  placeholder="Image URL"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
               /> */}
               <label className="text-gray-700 font-medium">Upload Image</label>
               <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                     e.target.files && setImage(e.target.files[0])
                  }
                  className="px-4 py-3 border rounded-xl focus:ring-4 focus:ring-green-500 focus:outline-none bg-gray-50"
               />
               <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
               />
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
