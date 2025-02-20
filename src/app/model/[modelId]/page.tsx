"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Category, Model, Product } from "@/types/types";
import Loader from "@/components/ui/Loader";

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
      <div className="container mx-auto px-4 py-10 mt-32">
         <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
            Explore <span className="text-blue-700">{category?.title}</span> -
            <span className="text-blue-700"> {model?.title}</span>
         </h1>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
               <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
               >
                  <a
                     href={product.image}
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     <Image
                        src={product.image}
                        alt={product.title}
                        width={400}
                        height={250}
                        className="w-full h-40 object-cover cursor-pointer"
                     />
                  </a>
                  <div className="p-4">
                     <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">
                           {product.title}
                        </h2>
                        {product.rating_value && (
                           <span className="text-sm font-medium text-gray-700">
                              {product.rating_value} {product.rating_unit}
                           </span>
                        )}
                     </div>
                     <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                        {product.description}
                     </p>
                     <button
                        onClick={() => handleWhatsAppClick({ product })}
                        className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-all shadow-md hover:shadow-lg text-sm font-medium"
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
