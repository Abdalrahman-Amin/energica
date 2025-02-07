"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Product } from "@/types/types";
import { useRouter } from "next/navigation";

const ModelsProducts = () => {
   const { categorySlug, modelSlug } = useParams();
   const [products, setProducts] = useState<Product[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const supabase = createClientComponentClient();
   const router = useRouter();

   useEffect(() => {
      const fetchProducts = async () => {
         try {
            if (categorySlug && modelSlug) {
               const { data, error } = await supabase
                  .from("products")
                  .select(
                     `
                     *,
                     categories!inner(slug),
                     models!inner(slug)
                  `
                  )
                  .eq("categories.slug", categorySlug)
                  .eq("models.slug", modelSlug);

               if (error) {
                  throw error;
               }

               setProducts(data || []);
            }
         } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to fetch products. Please try again later.");
         } finally {
            setIsLoading(false);
         }
      };

      fetchProducts();
   }, [categorySlug, modelSlug, supabase]);

   interface HandleViewDetails {
      (productSlug: string): void;
   }

   const handleViewDetails: HandleViewDetails = (productSlug) => {
      router.push(`/product/${productSlug}`);
   };

   if (isLoading) {
      return (
         <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="flex justify-center items-center h-screen">
            <p className="text-red-500 text-lg">{error}</p>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8 mt-56">
         <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Products for Category:{" "}
            <span className="text-blue-600">{categorySlug}</span> and Model:{" "}
            <span className="text-blue-600">{modelSlug}</span>
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
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                        onClick={() => handleViewDetails(product.slug)}
                     >
                        View Details
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ModelsProducts;
