"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category, Model } from "@/types/types";
// import { set } from "lodash";

interface AddModelFormProps {
   setToggleAddedModel: () => void;
   selectedModel: Model | null;
   clearSelectedModel: () => void;
}

const AddModelForm: React.FC<AddModelFormProps> = ({
   setToggleAddedModel,
   clearSelectedModel,
   selectedModel,
}) => {
   const [categories, setCategories] = useState<Category[]>([]);
   const [selectedCategory, setSelectedCategory] = useState("");
   const [ratingVal, setRatingVal] = useState(0);
   const [ratingUnit, setRatingUnit] = useState("");
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [image, setImage] = useState<File | null>(null);
   const [pdfFile, setPdfFile] = useState<File | null>(null); // State for the PDF file
   const [loading, setLoading] = useState(false);
   const supabase = createClientComponentClient();

   useEffect(() => {
      const fetchCategories = async () => {
         const { data, error } = await supabase.from("categories").select("*");
         if (error) console.error("Error fetching categories:", error);
         else setCategories(data || []);
      };

      fetchCategories();
   }, [supabase]);

   useEffect(() => {
      if (selectedModel) {
         setTitle(selectedModel.title);
         setDescription(selectedModel.description);
         setRatingVal(selectedModel.rating_value);
         setRatingUnit(selectedModel.rating_unit);
         // setImageUrl(selectedModel.image);
         // setPdfFileUrl(selectedModel.pdf_url);
         // Fetch the category linked to the model
         const fetchCategoryModel = async () => {
            const { data, error } = await supabase
               .from("category_models")
               .select("category_id")
               .eq("model_id", selectedModel.id)
               .single();
            if (error) console.error("Error fetching category model:", error);
            else setSelectedCategory(data.category_id.toString());
         };
         fetchCategoryModel();
      }
   }, [selectedModel, supabase]);

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

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
         let pdfUrl = null;
         let imgUrl = null;

         // Upload the PDF file if it exists
         if (pdfFile) {
            const uploadResponse = await handlePdfUpload(
               pdfFile,
               "model-pdfs",
               `pdfs`
            );
            if (!uploadResponse) {
               alert("Failed to upload PDF.");
               setLoading(false);
               return;
            }
            pdfUrl = uploadResponse.data.publicUrl;
         }

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

         if (selectedModel) {
            const { data: modelData, error: modelError } = await supabase
               .from("models")
               .update({
                  title,
                  slug: title.toLowerCase().replace(" ", "-"),
                  description,
                  image: imgUrl ? imgUrl : selectedModel.image,
                  pdf_url: pdfUrl ? pdfUrl : selectedModel.pdf_url,
                  rating_value: ratingVal,
                  rating_unit: ratingUnit,
               })
               .eq("id", selectedModel.id)
               .select();

            if (modelError) throw modelError;

            // Update the category_models table
            const { error: linkError } = await supabase
               .from("category_models")
               .update({ category_id: selectedCategory })
               .eq("model_id", selectedModel.id);

            if (linkError) throw linkError;
            console.log(modelData);
            alert("Model updated successfully!");
         } else {
            // Insert the model into the database
            const { data: modelData, error: modelError } = await supabase
               .from("models")
               .insert([
                  {
                     title,
                     slug: title.toLowerCase().replace(" ", "-"),
                     description,
                     image: imgUrl,
                     pdf_url: pdfUrl,
                     rating_value: ratingVal,
                     rating_unit: ratingUnit,
                  },
               ])
               .select();

            if (modelError) throw modelError;

            // Link the model to the selected category
            const { error: linkError } = await supabase
               .from("category_models")
               .insert([
                  { category_id: selectedCategory, model_id: modelData[0].id },
               ]);

            if (linkError) throw linkError;

            alert("Model added successfully!");
         }
         setToggleAddedModel();
         clearSelectedModel();

         setTitle("");
         setDescription("");
         setImage(null);
         setPdfFile(null);
         setSelectedCategory("");
         setRatingVal(0);
         setRatingUnit("");
      } catch (error) {
         console.error("Error adding model:", error);
         alert("Failed to add model.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex items-center justify-center bg-gray-900 w-full">
         <div className="bg-gray-800 shadow-xl rounded-xl p-6 w-full max-w-md sm:max-w-lg border border-gray-700">
            <h1 className="text-2xl sm:text-3xl font-semibold text-center text-white mb-4">
               {selectedModel ? "Edit Model" : "Add Model"}
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
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
               <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
               />
               <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
               />
               <input
                  type="number"
                  placeholder="Rating Value"
                  value={ratingVal}
                  onChange={(e) => setRatingVal(Number(e.target.value))}
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
               />
               <input
                  type="text"
                  placeholder="Rating Unit"
                  value={ratingUnit}
                  onChange={(e) => setRatingUnit(e.target.value)}
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
               />
               <label className="text-gray-300 font-medium">Upload Image</label>
               <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                     e.target.files && setImage(e.target.files[0])
                  }
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
               />
               <label className="text-gray-300 font-medium">
                  Upload Data Sheet (PDF)
               </label>
               <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                     e.target.files && setPdfFile(e.target.files[0])
                  }
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
               />
               <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-green-500 text-white rounded-md font-bold hover:bg-green-600 transition-all duration-300 disabled:bg-gray-500 shadow-md"
               >
                  {loading
                     ? selectedModel
                        ? "Updating..."
                        : "Adding..."
                     : selectedModel
                     ? "Update Model"
                     : "Add Model"}
               </button>
            </form>
         </div>
      </div>
   );
};

export default AddModelForm;
