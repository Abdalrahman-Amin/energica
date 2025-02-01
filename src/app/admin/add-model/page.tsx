"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Category } from "@/types/types";

const AddModelForm = () => {
   const [categories, setCategories] = useState<Category[]>([]);
   const [selectedCategory, setSelectedCategory] = useState("");
   const [slug, setSlug] = useState("");
   const [title, setTitle] = useState("");
   const [description, setDescription] = useState("");
   const [image, setImage] = useState<File | null>(null);
   const [pdfFile, setPdfFile] = useState<File | null>(null); // State for the PDF file
   const [loading, setLoading] = useState(false);
   const supabase = createClientComponentClient();
   const router = useRouter();

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
      const { data, error } = await supabase.storage
         .from(bucketName) // Bucket name   model-pdfs
         .upload(path, file); // File path and file object  `pdfs/${file.name}`

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
               `pdfs/${pdfFile.name}`
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
               `imgs/${image.name}`
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
               { title, slug, description, image: imgUrl, pdf_url: pdfUrl },
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
         router.push("/admin/dashboard");
      } catch (error) {
         console.error("Error adding model:", error);
         alert("Failed to add model.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-200 to-blue-200 mt-11">
         <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg border border-gray-200">
            <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
               Add Model
            </h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
               <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border rounded-xl focus:ring-4 focus:ring-green-500 focus:outline-none bg-gray-50"
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
                  className="px-4 py-3 border rounded-xl focus:ring-4 focus:ring-green-500 focus:outline-none bg-gray-50"
                  required
               />
               <input
                  type="text"
                  placeholder="Slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="px-4 py-3 border rounded-xl focus:ring-4 focus:ring-green-500 focus:outline-none bg-gray-50"
                  required
               />
               <input
                  type="text"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="px-4 py-3 border rounded-xl focus:ring-4 focus:ring-green-500 focus:outline-none bg-gray-50"
                  required
               />
               <label className="text-gray-700 font-medium">Upload Image</label>
               <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                     e.target.files && setImage(e.target.files[0])
                  }
                  className="px-4 py-3 border rounded-xl focus:ring-4 focus:ring-green-500 focus:outline-none bg-gray-50"
               />
               <label className="text-gray-700 font-medium">
                  Upload Data Sheet
               </label>
               <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                     e.target.files && setPdfFile(e.target.files[0])
                  }
                  className="px-4 py-3 border rounded-xl focus:ring-4 focus:ring-green-500 focus:outline-none bg-gray-50"
               />
               <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-blue-600 transition-all duration-300 disabled:bg-gray-400 shadow-lg"
               >
                  {loading ? "Adding..." : "Add Model"}
               </button>
            </form>
         </div>
      </div>
   );
};

export default AddModelForm;
