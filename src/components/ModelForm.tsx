"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category } from "@/types/types";

interface AddModelFormProps {
   setToggleAddedModel: () => void;
}

const AddModelForm = ({ setToggleAddedModel }: AddModelFormProps) => {
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
         setToggleAddedModel();

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
      <div className="flex items-center justify-center bg-gray-900 w-[90%]">
         <div className="bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-lg border border-gray-700">
            <h1 className="text-3xl font-bold text-center text-white mb-6">
               Add Model
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
               <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
               />
               <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
               />
               <input
                  type="number"
                  placeholder="Rating value"
                  value={ratingVal}
                  onChange={(e) => setRatingVal(Number(e.target.value))}
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
               />
               <input
                  type="text"
                  placeholder="Rating Unit"
                  value={ratingUnit}
                  onChange={(e) => setRatingUnit(e.target.value)}
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
                  required
               />
               <label className="text-gray-300 font-medium">Upload Image</label>
               <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                     e.target.files && setImage(e.target.files[0])
                  }
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
               />
               <label className="text-gray-300 font-medium">
                  Upload Data Sheet
               </label>
               <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                     e.target.files && setPdfFile(e.target.files[0])
                  }
                  className="px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
               />
               <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-all duration-300 disabled:bg-gray-500 shadow-md"
               >
                  {loading ? "Adding..." : "Add Model"}
               </button>
            </form>
         </div>
      </div>
   );
};

export default AddModelForm;
