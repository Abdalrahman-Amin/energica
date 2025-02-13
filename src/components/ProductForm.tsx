"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category, Model, Category_Models, Product } from "@/types/types";

interface AddProductFormProps {
   setToggleAddedProduct: () => void;
   selectedProduct: Product | null;
   clearSelectedProduct: () => void;
}

const AddProductForm = ({
   setToggleAddedProduct,
   clearSelectedProduct,
   selectedProduct,
}: AddProductFormProps) => {
   const [categories, setCategories] = useState<Category[]>([]);
   const [models, setModels] = useState<Model[]>([]);
   const [selectedCategory, setSelectedCategory] = useState("");
   const [selectedModel, setSelectedModel] = useState("");
   const [ratingVal, setRatingVal] = useState(0);
   const [ratingUnit, setRatingUnit] = useState("");
   const [filteredModels, setFilteredModels] = useState<Model[]>([]);
   const [categoryModels, setCategoryModels] = useState<Category_Models[]>([]);
   const [title, setTitle] = useState("");
   const [image, setImage] = useState<File | null>(null);
   const [description, setDescription] = useState("");
   const [loading, setLoading] = useState(false);
   const supabase = createClientComponentClient();

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

   useEffect(() => {
      if (selectedProduct) {
         setTitle(selectedProduct.title);
         setDescription(selectedProduct.description);
         setRatingVal(selectedProduct.rating_value);
         setRatingUnit(selectedProduct.rating_unit);
         setSelectedCategory(selectedProduct.category.toString());
         setSelectedModel(selectedProduct.model.toString());
      }
   }, [selectedProduct]);

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

         if (selectedProduct) {
            // Update existing product
            const { data, error } = await supabase
               .from("products")
               .update({
                  title,
                  image: imgUrl ? imgUrl : selectedProduct.image,
                  description,
                  category: selectedCategory,
                  model: selectedModel,
                  slug,
                  rating_value: ratingVal,
                  rating_unit: ratingUnit,
               })
               .eq("id", selectedProduct.id)
               .select();

            if (error) throw error;
            console.log("DEBUG: ~ handleSubmit ~ data:", data);
            alert("Product updated successfully!");
         } else {
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
                     rating_value: ratingVal,
                     rating_unit: ratingUnit,
                  },
               ])
               .select();
            console.log("DEBUG: ~ handleSubmit ~ data:", data);

            if (error) throw error;

            alert("Product added successfully!");
         }
         setToggleAddedProduct();
         clearSelectedProduct();

         setTitle("");
         setSelectedCategory("");
         setSelectedModel("");
         setRatingVal(0);
         setRatingUnit("");
         setImage(null);
      } catch (error) {
         console.error("Error adding product:", error);
         alert("Failed to add product.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex items-center justify-center  bg-gray-900 w-[90%]">
         <div className="bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-lg border border-gray-700">
            <h1 className="text-3xl font-bold text-center text-white mb-6">
               {selectedProduct ? "Edit Product" : "Add Product"}
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
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
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
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
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
               />
               {/* <div className="flex gap-4"> */}
               <input
                  type="number"
                  placeholder="Rating Value"
                  value={ratingVal}
                  onChange={(e) => setRatingVal(Number(e.target.value))}
                  className=" px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
               />
               <input
                  type="text"
                  placeholder="Rating Unit"
                  value={ratingUnit}
                  onChange={(e) => setRatingUnit(e.target.value)}
                  className=" px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
               />
               {/* </div> */}
               <label className="text-gray-300 font-medium">Upload Image</label>
               <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                     e.target.files && setImage(e.target.files[0])
                  }
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
               />
               <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
               ></textarea>
               <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-all duration-300 disabled:bg-gray-500 shadow-md"
               >
                  {loading
                     ? selectedProduct
                        ? "Updating..."
                        : "Adding..."
                     : selectedProduct
                     ? "Update Product"
                     : "Add Product"}
               </button>
            </form>
         </div>
      </div>
   );
};

export default AddProductForm;
