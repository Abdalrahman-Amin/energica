"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category, Model, Product } from "@/types/types";
import Loader from "@/components/Loader";

const ModelsProducts = () => {
   const { modelId } = useParams();
   const [model, setModel] = useState<Model | null>(null);
   const [category, setCategory] = useState<Category | null>(null);
   const [products, setProducts] = useState<Product[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const supabase = createClientComponentClient();

   useEffect(() => {
      const fetchModelAndCategory = async () => {
         try {
            // Fetch the model by its ID
            const { data: modelData, error: modelError } = await supabase
               .from("models")
               .select("*")
               .eq("id", modelId)
               .single();

            if (modelError) throw modelError;
            setModel(modelData);

            // Fetch the category associated with the model using category_models table
            const { data: categoryModelData, error: categoryModelError } =
               await supabase
                  .from("category_models")
                  .select("category_id")
                  .eq("model_id", modelId)
                  .single();

            if (categoryModelError) throw categoryModelError;

            const { data: categoryData, error: categoryError } = await supabase
               .from("categories")
               .select("*")
               .eq("id", categoryModelData.category_id)
               .single();

            if (categoryError) throw categoryError;
            setCategory(categoryData);

            // Fetch products associated with the model
            const { data: productsData, error: productsError } = await supabase
               .from("products")
               .select("*")
               .eq("model", modelId);

            if (productsError) throw productsError;
            setProducts(productsData || []);
         } catch (error) {
            console.error("Error fetching data:", error);
            setError("Failed to fetch data. Please try again later.");
         } finally {
            setIsLoading(false);
         }
      };

      if (modelId) {
         fetchModelAndCategory();
      }
   }, [modelId, supabase]);

   const handleWhatsAppClick = ({ product }: { product: Product | null }) => {
      const message = `Hello, I'm interested in the product: ${product?.title}`;
      const phoneNumber = "+2001066651786"; // Replace with your phone number
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
         message
      )}`;
      window.open(url, "_blank");
   };

   if (isLoading) {
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
      <div className="container mx-auto px-4 py-8 mt-48">
         <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Products for Category:{" "}
            <span className="text-blue-600">{category?.title}</span> and Model:{" "}
            <span className="text-blue-600">{model?.title}</span>
         </h1>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
               <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
               >
                  <Image
                     src={product.image}
                     alt={product.title}
                     width={500}
                     height={300}
                     className="w-full h-48 object-cover"
                  />

                  <div className="p-6">
                     <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {product.title}
                     </h2>
                     <p className="text-sm text-gray-600 mb-4">
                        {product.description}
                     </p>
                     <button
                        onClick={() => handleWhatsAppClick({ product })}
                        className="mt-6 w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
                     >
                        Contact on WhatsApp
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ModelsProducts;
