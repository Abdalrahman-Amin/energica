"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Product } from "@/types/types";
import Image from "next/image";

const ProductPage = () => {
   const { productSlug } = useParams();
   const [product, setProduct] = useState<Product | null>(null);
   const [categoryName, setCategoryName] = useState<string | null>(null);
   const [modelName, setModelName] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const supabase = createClientComponentClient();

   useEffect(() => {
      const fetchProduct = async () => {
         try {
            if (!productSlug) return;

            const { data: productData, error: productError } = await supabase
               .from("products")
               .select("*, categories(title), models(title)")
               .eq("slug", productSlug)
               .single();

            if (productError) throw productError;

            setProduct(productData);
            setCategoryName(productData.categories?.title || "Unknown");
            setModelName(productData.models?.title || "Unknown");
         } catch (error) {
            console.error("Error fetching product:", error);
            setError(
               "Failed to fetch product details. Please try again later."
            );
         } finally {
            setIsLoading(false);
         }
      };

      fetchProduct();
   }, [productSlug, supabase]);

   const handleWhatsAppClick = () => {
      const message = `Hello, I'm interested in the product: ${product?.title}`;
      const phoneNumber = "01012731091"; // Replace with your phone number
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
         message
      )}`;
      window.open(url, "_blank");
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

   if (!product) {
      return (
         <div className="flex justify-center items-center h-screen">
            <p className="text-gray-600 text-lg">Product not found.</p>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-12 mt-60">
         <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
            <div className="relative h-96">
               <Image
                  src={product.image}
                  alt={product.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
               />
            </div>
            <div className="p-8">
               <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {product.title}
               </h1>
               <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {product.description}
               </p>
               <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                     Product Details
                  </h2>
                  <ul className="space-y-2 text-gray-600 text-lg">
                     <li>
                        <strong>Category:</strong> {categoryName}
                     </li>
                     <li>
                        <strong>Brand:</strong> {modelName}
                     </li>
                  </ul>
               </div>
               <button
                  onClick={handleWhatsAppClick}
                  className="mt-6 w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-all shadow-md hover:shadow-lg"
               >
                  Contact on WhatsApp
               </button>
            </div>
         </div>
      </div>
   );
};

export default ProductPage;
